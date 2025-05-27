import React from 'react';
import { Text, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { clsx } from 'clsx';

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  iconName?: keyof typeof FontAwesome.glyphMap;
  iconColor?: string;
  iconSize?: number;
  className?: string;
  textClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  iconName,
  iconColor = '#fff',
  iconSize = 20,
  className = '',
  textClassName = 'font-semibold text-center text-white',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${className} flex-row items-center justify-center py-3 rounded-lg`}
      >
      {iconName && (
        <FontAwesome name={iconName} size={iconSize} color={iconColor} className="mr-2" />
      )}
      <Text className={textClassName}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
