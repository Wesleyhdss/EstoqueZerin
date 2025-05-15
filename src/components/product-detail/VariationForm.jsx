
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const VariationForm = ({ parentProduct, variation, onSave, onCancel }) => {
  const [sku, setSku] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (variation) {
      setSku(variation.id || '');
      setSize(variation.size || '');
      setColor(variation.color || '');
      setStock(variation.stock !== undefined ? variation.stock : 0);
      setPrice(variation.price !== undefined ? String(variation.price) : String(parentProduct.price));
      setImageUrl(variation.imageUrl || parentProduct.imageUrl || '');
    } else {
      setSku('');
      setSize('');
      setColor('');
      setStock(0);
      setPrice(String(parentProduct.price));
      setImageUrl(parentProduct.imageUrl || '');
    }
  }, [variation, parentProduct]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sku || stock < 0 || price === '') {
      toast({ title: "Erro", description: "SKU da variação, Estoque e Preço são obrigatórios.", variant: "destructive" });
      return;
    }
    onSave({ 
      id: sku, 
      size, 
      color, 
      stock: parseInt(stock, 10), 
      price: parseFloat(price),
      imageUrl
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div>
        <Label htmlFor="var-sku">SKU da Variação (ID)</Label>
        <Input id="var-sku" value={sku} onChange={(e) => setSku(e.target.value)} placeholder={`Ex: ${parentProduct.id}-P-AZUL`} required disabled={!!variation} />
         {!!variation && <p className="text-xs text-muted-foreground mt-1">SKU não pode ser alterado após a criação.</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="var-size">Tamanho</Label>
          <Input id="var-size" value={size} onChange={(e) => setSize(e.target.value)} placeholder="Ex: P, M, 38" />
        </div>
        <div>
          <Label htmlFor="var-color">Cor</Label>
          <Input id="var-color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Ex: Azul, Vermelho" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="var-stock">Estoque</Label>
          <Input id="var-stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Ex: 10" required />
        </div>
        <div>
          <Label htmlFor="var-price">Preço</Label>
          <Input id="var-price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder={`Padrão: ${parentProduct.price.toFixed(2)}`} required/>
        </div>
      </div>
      <div>
        <Label htmlFor="var-image-url">URL da Imagem (Opcional)</Label>
        <Input id="var-image-url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://exemplo.com/imagem_variacao.jpg" />
        <p className="text-xs text-muted-foreground mt-1">Se não informado, usará a imagem do produto pai (se houver).</p>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{variation ? 'Salvar Variação' : 'Adicionar Variação'}</Button>
      </DialogFooter>
    </form>
  );
};

export default VariationForm;
  