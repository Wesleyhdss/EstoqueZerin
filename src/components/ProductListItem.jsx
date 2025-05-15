
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Package, Shirt } from 'lucide-react';

const ProductListItem = ({ product, onDelete, index }) => {
  const navigate = useNavigate();
  const totalStock = product.variations && product.variations.length > 0
    ? product.variations.reduce((acc, v) => acc + v.stock, 0)
    : product.stock;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors duration-200"
    >
      <div className="flex items-center gap-4 flex-grow min-w-0">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="h-16 w-16 object-cover rounded-md hidden sm:block"
          />
        ) : (
          <div className="h-16 w-16 bg-slate-700 rounded-md flex items-center justify-center hidden sm:block">
            <Shirt size={32} className="text-slate-500" />
          </div>
        )}
        <div className="flex-grow min-w-0">
          <h3 className="text-lg font-semibold text-primary truncate" title={product.name}>
            {product.name}
          </h3>
          <p className="text-sm text-slate-400 truncate" title={product.id}>SKU: {product.id}</p>
          <p className="text-sm text-slate-500 truncate hidden md:block" title={product.category}>
            Categoria: {product.category || 'N/A'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-4 flex-shrink-0">
        <div className="text-right hidden lg:block">
          <p className="text-lg font-semibold text-accent">R$ {product.price.toFixed(2)}</p>
          <div className="flex items-center justify-end gap-1 text-slate-400">
            <Package size={16} />
            <span>{totalStock}</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="border-primary text-primary hover:bg-primary/10"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <Edit3 className="mr-0 sm:mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Detalhes</span>
        </Button>
        <Button 
          variant="destructive" 
          size="icon" 
          onClick={() => onDelete(product.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductListItem;
  