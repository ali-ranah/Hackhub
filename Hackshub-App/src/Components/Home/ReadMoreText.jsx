import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const ReadMoreText = ({ text, numberOfLines }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View>
      <Text
        className="text-sm font-bold text-black"
        numberOfLines={isExpanded ? undefined : numberOfLines}
      >
        {text}
      </Text>
      {text.length > 50 && (
        <TouchableOpacity onPress={toggleExpand}>
          <Text className="text-sm font-bold text-black">{isExpanded ? 'Read Less' : 'Read More'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ReadMoreText;
