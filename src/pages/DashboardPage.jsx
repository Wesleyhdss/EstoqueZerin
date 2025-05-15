
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsStore } from '@/hooks/useProductsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProductForm from '@/components/forms/ProductForm';
import ProductListItem from '@/components/ProductListItem';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Search, Package, Edit3, Trash2, Shirt, ShoppingBag, LayoutGrid, List } from 'lucide-react';

const VIEW_MODE_KEY = 'inventoryAppViewMode';

const DashboardPage = () => {
  const { products, addProduct, setProducts } = useProductsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState(localStorage.getItem(VIEW_MODE_KEY) || 'grid'); // 'grid' or 'list'
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleAddProduct = (productData) => {
    addProduct(productData);
    setIsAddModalOpen(false);
  };
  
  const handleDeleteProduct = (productId) => {
    if (window.confirm("Tem certeza que deseja excluir este produto e todas as suas variações?")) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({ title: "Sucesso", description: "Produto excluído." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
        >
          Estoque de Roupas
        </motion.h1>
        <div className="flex items-center gap-4">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => { if (value) setViewMode(value); }} className="hidden sm:flex">
            <ToggleGroupItem value="grid" aria-label="Visualização em Grade">
              <LayoutGrid className="h-5 w-5" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Visualização em Lista">
              <List className="h-5 w-5" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300">
                <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] glassmorphism text-foreground">
              <DialogHeader>
                <DialogTitle className="text-2xl">Adicionar Novo Produto</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes do novo produto. O SKU será o ID único.
                </DialogDescription>
              </DialogHeader>
              <ProductForm onSave={handleAddProduct} onCancel={() => setIsAddModalOpen(false)} product={null} />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 relative"
      >
        <Input
          type="text"
          placeholder="Buscar por nome ou SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 text-lg bg-slate-800 border-slate-700 placeholder-slate-500 text-white focus:ring-primary focus:border-primary"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
      </motion.div>
      
      <div className="sm:hidden mb-4">
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => { if (value) setViewMode(value); }} className="w-full flex">
          <ToggleGroupItem value="grid" aria-label="Visualização em Grade" className="flex-1">
            <LayoutGrid className="h-5 w-5 mr-2" /> Grade
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Visualização em Lista" className="flex-1">
            <List className="h-5 w-5 mr-2" /> Lista
          </ToggleGroupItem>
        </ToggleGroup>
      </div>


      {filteredProducts.length === 0 && searchTerm && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-slate-400 text-xl mt-10"
        >
          Nenhum produto encontrado com "{searchTerm}".
        </motion.p>
      )}

      {filteredProducts.length === 0 && !searchTerm && (
         <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-slate-400 mt-10 p-8 border-2 border-dashed border-slate-700 rounded-lg"
        >
          <ShoppingBag size={64} className="mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-semibold mb-2">Seu estoque está vazio!</h2>
          <p className="mb-4">Comece adicionando seu primeiro produto "pai" para organizar seu inventário.</p>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300">
            <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Primeiro Produto
          </Button>
        </motion.div>
      )}

      <AnimatePresence mode="popLayout">
        {viewMode === 'grid' ? (
          <motion.div 
            key="product-grid"
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-slate-800 border-slate-700 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-semibold text-primary truncate" title={product.name}>{product.name}</CardTitle>
                        <CardDescription className="text-slate-400">SKU: {product.id}</CardDescription>
                      </div>
                      <Shirt size={36} className="text-accent opacity-70" />
                    </div>
                    {product.imageUrl && (
                      <div className="mt-4 h-40 w-full overflow-hidden rounded-md">
                         <img  src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-1 line-clamp-2" title={product.description || 'Sem descrição'}>{product.description || 'Sem descrição'}</p>
                    <p className="text-slate-400 text-sm">Categoria: {product.category || 'N/A'}</p>
                    <p className="text-2xl font-bold text-accent mt-2">R$ {product.price.toFixed(2)}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Package size={20} className="text-primary" />
                      <span className="text-lg font-medium">
                        Estoque Total: {product.variations && product.variations.length > 0 ? product.variations.reduce((acc, v) => acc + v.stock, 0) : product.stock} unidades
                      </span>
                    </div>
                     {product.variations && product.variations.length > 0 && (
                      <p className="text-sm text-slate-500">({product.variations.length} variações)</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" onClick={() => navigate(`/product/${product.id}`)}>
                      <Edit3 className="mr-2 h-4 w-4" /> Detalhes / Variações
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="product-list"
            layout
            className="space-y-3"
          >
            {filteredProducts.map((product, index) => (
              <ProductListItem 
                key={product.id} 
                product={product} 
                onDelete={handleDeleteProduct}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
  