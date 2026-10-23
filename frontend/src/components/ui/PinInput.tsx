import React, { useState, useRef, useEffect } from 'react';

interface PinInputProps {
  length?: number;
  onComplete: (pin: string) => void;
  error?: string;
}

const PinInput: React.FC<PinInputProps> = ({ 
  length = 6, 
  onComplete,
  error
}) => {
  const [pin, setPin] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Pre-populate the refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // Only accept numbers
    if (!/^\d*$/.test(value)) return;
    
    // Update the pin array with the new value (take only the last character)
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    
    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Check if pin is complete
    const newPinString = newPin.join('');
    if (newPinString.length === length && !newPinString.includes('')) {
      onComplete(newPinString);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content is all digits
    if (!/^\d+$/.test(pastedData)) return;
    
    // Fill the pin array with the pasted digits
    const newPin = [...pin];
    for (let i = 0; i < Math.min(length, pastedData.length); i++) {
      newPin[i] = pastedData[i];
    }
    setPin(newPin);
    
    // Focus the next empty input or the last one if all are filled
    const nextEmptyIndex = newPin.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
    
    // Check if pin is complete
    const newPinString = newPin.join('');
    if (newPinString.length === length && !newPinString.includes('')) {
      onComplete(newPinString);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center gap-2">
        {pin.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(e, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            className={`
              w-12 h-14 text-center text-xl font-bold
              border-2 rounded-md
              focus:outline-none focus:ring-2 focus:ring-primary-500
              dark:bg-gray-800 dark:text-white
              ${error ? 'border-danger-500' : 'border-gray-300 dark:border-gray-600'}
            `}
            autoFocus={index === 0}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-danger-500">{error}</p>
      )}
    </div>
  );
};

export default PinInput;