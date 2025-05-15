
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const StockAdjustmentModal = ({ item, currentStock, onAdjust, onCancel, isVariation }) => {
  const [adjustment, setAdjustment] = useState(0);
  const type = isVariation ? "Variação" : "Produto Pai";

  const handleAdjust = () => {
    onAdjust(parseInt(adjustment, 10));
  };

  return (
    <DialogContent className="sm:max-w-[425px] glassmorphism text-foreground">
      <DialogHeader>
        <DialogTitle>Ajustar Estoque: {item.name || item.id}</DialogTitle>
        <DialogDescription>
          Estoque atual ({type}): {currentStock}. Insira a quantidade para adicionar (+) ou remover (-).
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="adjustment" className="text-right col-span-1">
            Ajuste
          </Label>
          <Input
            id="adjustment"
            type="number"
            value={adjustment}
            onChange={(e) => setAdjustment(e.target.value)}
            className="col-span-3"
            placeholder="Ex: 10 ou -5"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleAdjust}>Ajustar Estoque</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default StockAdjustmentModal;
  