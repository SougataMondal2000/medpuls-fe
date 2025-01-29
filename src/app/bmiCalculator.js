export const calculateBMI = (height, weight) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(1);
};

export const calculateBMIPosition = (bmi) => {
  if (bmi < 18.5) return (bmi / 18.5) * 20;
  if (bmi < 25) return 20 + ((bmi - 18.5) / 6.5) * 20;
  if (bmi < 30) return 40 + ((bmi - 25) / 5) * 20;
  if (bmi < 35) return 60 + ((bmi - 30) / 5) * 20;
  return Math.min(80 + ((bmi - 35) / 5) * 20, 100);
};

export const getBMIMessage = (bmi) => {
  const numBmi = parseFloat(bmi);
  if (numBmi < 18.5) {
    return "Underweight: Consider consulting with a healthcare provider about healthy weight gain strategies.";
  } else if (numBmi < 25) {
    return "Normal weight: Maintain healthy lifestyle with balanced diet and regular exercise.";
  } else if (numBmi < 30) {
    return "Overweight: Focus on balanced diet and regular physical activity for optimal health.";
  } else if (numBmi < 35) {
    return "Obese: Consider consulting with healthcare providers about weight management strategies.";
  } else {
    return "Severely Obese: Personalized weight management guidance required.";
  }
};
