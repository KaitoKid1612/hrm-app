import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface ListInputFieldProps {
  title: string;
  items: string[];
  placeholder: string;
  onAdd: (value: string) => boolean;
  onRemove: (index: number) => void;
}

export const ListInputField = ({
  title,
  items,
  placeholder,
  onAdd,
  onRemove,
}: ListInputFieldProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (onAdd(inputValue)) {
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length > 0 && (
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-gray-700">• {item}</span>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-red-600 hover:text-red-700 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            onKeyPress={handleKeyPress}
          />
          <Button type="button" onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
