
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Edit3, Trash2, PackagePlus, PackageMinus, Palette, Ruler } from 'lucide-react';

const VariationCard = ({ variation, productImageUrl, onEdit, onDelete, onAdjustStock, index }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="bg-slate-800/80 border-slate-700/70 glassmorphism hover:border-accent transition-colors">
        <CardHeader>
          {(variation.imageUrl && variation.imageUrl !== productImageUrl) && (
            <div className="mb-2 h-32 w-full overflow-hidden rounded-md">
              <img src={variation.imageUrl} alt={`Variação ${variation.size || ''} ${variation.color || ''}`} className="h-full w-full object-cover" />
            </div>
          )}
          <CardTitle className="text-lg text-accent/90">
            {variation.size && <><Ruler size={16} className="inline mr-1 mb-0.5" /> {variation.size}</>}
            {variation.size && variation.color && " / "}
            {variation.color && <><Palette size={16} className="inline mr-1 mb-0.5" /> {variation.color}</>}
            {(!variation.size && !variation.color) && `Variação ${variation.id.substring(variation.id.lastIndexOf('-') + 1)}`}
          </CardTitle>
          <CardDescription className="text-slate-500">SKU: {variation.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold text-purple-400">R$ {variation.price.toFixed(2)}</p>
          <p className="text-md text-slate-300">Estoque: {variation.stock} unidades</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center gap-1">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-300" onClick={() => onEdit(variation)}>
              <Edit3 size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400" onClick={() => onDelete(variation.id)}>
              <Trash2 size={18} />
            </Button>
          </div>
          <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10" onClick={() => onAdjustStock(variation, true)}>
            <PackagePlus size={16} className="mr-1" /> <PackageMinus size={16} className="mr-2" /> Estoque
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default VariationCard;
  