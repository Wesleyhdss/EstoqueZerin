
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Edit3, ImagePlus } from 'lucide-react';

const ProductDetailHeader = ({ product, onEdit }) => {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="text-3xl font-bold text-primary">{product.name}</CardTitle>
          <CardDescription className="text-slate-400">SKU: {product.id} | Categoria: {product.category || 'N/A'}</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onEdit} className="text-accent hover:text-accent/80">
          <Edit3 size={24} />
        </Button>
      </div>
      {product.imageUrl && (
        <motion.div 
          className="mt-4 h-60 w-full overflow-hidden rounded-md relative group"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 240 }}
          transition={{ duration: 0.5 }}
        >
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="outline" className="border-white text-white hover:bg-white/10" onClick={onEdit}>
              <ImagePlus className="mr-2 h-4 w-4" /> Alterar Imagem/Detalhes
            </Button>
          </div>
        </motion.div>
      )}
    </CardHeader>
  );
};

export default ProductDetailHeader;
  