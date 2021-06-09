import MealModal from '@components/modals/mealModal';
import React, { useState } from 'react';

const MealModalContext = React.createContext();

export const MealModalProvider = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState();

  const showMeal = (meal) => {
    setSelectedMeal(meal);
    setModalOpen(true);
  };

  return (
    <MealModalContext.Provider value={{ showMeal }}>
      <MealModal
        meal={selectedMeal}
        open={modalOpen}
        toggle={(open = !modalOpen) => setModalOpen(open)}
        onMealChange={setSelectedMeal}
      />
      {children}
    </MealModalContext.Provider>
  );
};

export default MealModalContext;
