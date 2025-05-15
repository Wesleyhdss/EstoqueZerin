
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductsStore } from '@/hooks/useProductsStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductForm from '@/components/forms/ProductForm';
import VariationForm from '@/components/product-detail/VariationForm';
import StockAdjustmentModal from '@/components/product-detail/StockAdjustmentModal';
import ProductDetailHeader from '@/components/product-detail/ProductDetailHeader';
import ProductDetailContent from '@/components/product-detail/ProductDetailContent';
import VariationCard from '@/components/product-detail/VariationCard';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, PlusCircle } from 'lucide-react';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { updateProduct, addVariation, updateVariation, updateStock, products } = useProductsStore();
  const [product, setProduct] = useState(null);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Combined modal state
  const [modalContent, setModalContent] = useState(null); // 'editProduct', 'addVariation', 'editVariation', 'adjustStock'
  const [currentItem, setCurrentItem] = useState(null); // For editing variation or adjusting stock
  
  const { toast } = useToast();

  useEffect(() => {
    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      toast({ title: "Erro", description: "Produto não encontrado.", variant: "destructive" });
      navigate('/dashboard');
    }
  }, [productId, products, navigate, toast]);

  const openModal = (content, item = null) => {
    setModalContent(content);
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setCurrentItem(null);
  };

  const handleSaveProduct = useCallback((updatedData) => {
    updateProduct(productId, updatedData);
    setProduct(prev => ({...prev, ...updatedData})); 
    closeModal();
  }, [productId, updateProduct]);

  const handleSaveVariation = useCallback((variationData) => {
    if (modalContent === 'editVariation' && currentItem) { 
      updateVariation(productId, currentItem.id, variationData);
    } else { 
      addVariation(productId, variationData);
    }
    closeModal();
  }, [productId, modalContent, currentItem, updateVariation, addVariation]);

  const handleDeleteVariation = useCallback((variationId) => {
    if (window.confirm("Tem certeza que deseja excluir esta variação?")) {
      const updatedVariations = product.variations.filter(v => v.id !== variationId);
      updateProduct(productId, { ...product, variations: updatedVariations });
      toast({ title: "Sucesso", description: "Variação excluída." });
    }
  }, [product, productId, updateProduct, toast]);
  
  const handleStockAdjust = useCallback((amount) => {
    if (currentItem) {
      const targetId = modalContent === 'adjustStockVariation' ? currentItem.id : null;
      updateStock(productId, targetId, amount);
      closeModal();
    }
  }, [productId, currentItem, modalContent, updateStock]);

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Carregando detalhes do produto...</div>;
  }

  const totalStock = product.variations && product.variations.length > 0 
    ? product.variations.reduce((sum, v) => sum + (v.stock || 0), 0)
    : (product.stock || 0);

  const renderModalContent = () => {
    if (!isModalOpen) return null;

    switch (modalContent) {
      case 'editProduct':
        return (
          <DialogContent className="sm:max-w-[525px] glassmorphism text-foreground">
            <DialogHeader>
              <DialogTitle>Editar Produto Pai: {product.name}</DialogTitle>
              <DialogDescription>Atualize os detalhes do produto pai. O SKU não pode ser alterado.</DialogDescription>
            </DialogHeader>
            <ProductForm product={product} onSave={handleSaveProduct} onCancel={closeModal} />
          </DialogContent>
        );
      case 'addVariation':
      case 'editVariation':
        return (
          <DialogContent className="sm:max-w-[525px] glassmorphism text-foreground">
            <DialogHeader>
              <DialogTitle>{modalContent === 'editVariation' ? 'Editar Variação' : 'Adicionar Nova Variação'}</DialogTitle>
              <DialogDescription>
                {modalContent === 'editVariation' ? `Modifique os detalhes da variação.` : `Preencha os detalhes da nova variação para ${product.name}.`}
              </DialogDescription>
            </DialogHeader>
            <VariationForm parentProduct={product} variation={modalContent === 'editVariation' ? currentItem : null} onSave={handleSaveVariation} onCancel={closeModal} />
          </DialogContent>
        );
      case 'adjustStockParent':
      case 'adjustStockVariation':
        return (
          <StockAdjustmentModal 
            item={currentItem}
            currentStock={modalContent === 'adjustStockVariation' ? currentItem.stock : product.stock}
            onAdjust={handleStockAdjust}
            onCancel={closeModal}
            isVariation={modalContent === 'adjustStockVariation'}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="outline" onClick={() => navigate('/dashboard')} className="mb-6 border-primary text-primary hover:bg-primary/10">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Card className="mb-8 bg-slate-800 border-slate-700 shadow-lg">
          <ProductDetailHeader product={product} onEdit={() => openModal('editProduct')} />
          <ProductDetailContent product={product} totalStock={totalStock} onAdjustStock={(item, isVariation) => openModal(isVariation ? 'adjustStockVariation' : 'adjustStockParent', item)} />
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-primary">Variações do Produto (Filhos)</h2>
          <Button onClick={() => openModal('addVariation')} className="bg-gradient-to-r from-accent to-purple-600 hover:opacity-90">
            <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Variação
          </Button>
        </div>

        {product.variations && product.variations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {product.variations.map((variation, index) => (
                <VariationCard 
                  key={variation.id}
                  variation={variation} 
                  productImageUrl={product.imageUrl}
                  onEdit={(v) => openModal('editVariation', v)}
                  onDelete={handleDeleteVariation}
                  onAdjustStock={(v, isVar) => openModal('adjustStockVariation', v)}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-slate-400 py-8 border-2 border-dashed border-slate-700 rounded-lg"
          >
            Nenhuma variação cadastrada para este produto.
          </motion.p>
        )}
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
        {renderModalContent()}
      </Dialog>
    </div>
  );
};

export default ProductDetailPage;
  