
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [initialStock, setInitialStock] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setSku(product.id || '');
      setCategory(product.category || '');
      setPrice(product.price !== undefined ? String(product.price) : '');
      setInitialStock(product.stock !== undefined ? product.stock : 0);
      setImageUrl(product.imageUrl || '');
    } else {
      // Reset form for new product
      setName('');
      setDescription('');
      setSku('');
      setCategory('');
      setPrice('');
      setInitialStock(0);
      setImageUrl('');
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !sku || price === '' || initialStock < 0) {
      toast({ title: "Erro", description: "Preencha os campos obrigatórios (Nome, SKU, Preço, Estoque Inicial).", variant: "destructive" });
      return;
    }
    onSave({ 
      id: sku, 
      name, 
      description, 
      category, 
      price: parseFloat(price), 
      stock: parseInt(initialStock, 10),
      imageUrl,
      variations: product ? product.variations : [] 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div>
        <Label htmlFor="product-sku">SKU (ID do Produto)</Label>
        <Input id="product-sku" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Ex: SKU001" required disabled={!!product} />
        {!!product && <p className="text-xs text-muted-foreground mt-1">SKU não pode ser alterado após a criação.</p>}
      </div>
      <div>
        <Label htmlFor="product-name">Nome do Produto</Label>
        <Input id="product-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Camiseta Estampada" required />
      </div>
      <div>
        <Label htmlFor="product-description">Descrição</Label>
        <Input id="product-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Algodão, gola redonda" />
      </div>
      <div>
        <Label htmlFor="product-category">Categoria</Label>
        <Input id="product-category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Vestuário Superior" />
      </div>
      <div>
        <Label htmlFor="product-price">Preço</Label>
        <Input id="product-price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex: 29.99" required />
      </div>
      <div>
        <Label htmlFor="product-stock">Estoque Inicial (Produto Pai)</Label>
        <Input id="product-stock" type="number" value={initialStock} onChange={(e) => setInitialStock(e.target.value)} placeholder="Ex: 50" required />
        <p className="text-xs text-muted-foreground mt-1">Este é o estoque do produto pai. Variações terão seus próprios estoques.</p>
      </div>
      <div>
        <Label htmlFor="product-image-url">URL da Imagem (Opcional)</Label>
        <Input id="product-image-url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://exemplo.com/imagem.jpg" />
        <p className="text-xs text-muted-foreground mt-1">Para demonstração, use URLs de imagens. Em um app real, haveria upload.</p>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{product ? 'Salvar Alterações' : 'Adicionar Produto'}</Button>
      </DialogFooter>
    </form>
  );
};

export default ProductForm;
  