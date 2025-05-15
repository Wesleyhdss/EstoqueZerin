
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { PackagePlus } from 'lucide-react';

const ProductDetailContent = ({ product, totalStock, onAdjustStock }) => {
  return (
    <CardContent>
      <p className="text-slate-300 mb-2">{product.description || 'Sem descrição detalhada.'}</p>
      <p className="text-2xl font-bold text-accent">R$ {product.price.toFixed(2)}</p>
      <div className="mt-4 flex items-center gap-2">
        <PackagePlus size={20} className="text-green-500" />
        <span className="text-lg font-medium">Estoque Total (Pai + Variações): {totalStock} unidades</span>
        {(!product.variations || product.variations.length === 0) && (
          <Button size="sm" variant="outline" className="ml-auto border-green-500 text-green-500 hover:bg-green-500/10" onClick={() => onAdjustStock(product, false)}>
            Ajustar Estoque Pai
          </Button>
        )}
      </div>
    </CardContent>
  );
};

export default ProductDetailContent;
  