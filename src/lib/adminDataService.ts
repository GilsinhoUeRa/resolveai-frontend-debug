
import { Profession, Specialty, ProfessionCategory } from '../types';
import { 
    MOCK_PROFESSIONS, 
    MANAGED_PROFESSIONS_STORAGE_KEY, 
    MANAGED_SPECIALTIES_STORAGE_KEY,
    MANAGED_CATEGORIES_STORAGE_KEY, // Nova chave
    MOCK_PROFESSION_CATEGORIES,      // Mock para categorias
    MOCK_SPECIALTIES_FALLBACK        // Mock para especialidades
} from '../constants';


// --- Profession Management ---

export const getManagedProfessions = (): Profession[] => {
  const stored = localStorage.getItem(MANAGED_PROFESSIONS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing managed professions from localStorage", e);
      return [...MOCK_PROFESSIONS]; 
    }
  }
  return [...MOCK_PROFESSIONS]; 
};

export const saveManagedProfessions = (professions: Profession[]): void => {
  localStorage.setItem(MANAGED_PROFESSIONS_STORAGE_KEY, JSON.stringify(professions));
};

export const addProfession = (profession: Omit<Profession, 'id'>): Profession => {
  const professions = getManagedProfessions();
  const newProfession: Profession = { 
    ...profession, 
    id: `prof_${Date.now()}_${Math.random().toString(16).slice(2)}` 
  };
  professions.push(newProfession);
  saveManagedProfessions(professions);
  return newProfession;
};

export const updateProfession = (updatedProfession: Profession): Profession | null => {
  let professions = getManagedProfessions();
  const index = professions.findIndex(p => p.id === updatedProfession.id);
  if (index !== -1) {
    professions[index] = updatedProfession;
    saveManagedProfessions(professions);
    return updatedProfession;
  }
  return null;
};

export const deleteProfession = (professionId: string): boolean => {
  let professions = getManagedProfessions();
  const initialLength = professions.length;
  professions = professions.filter(p => p.id !== professionId);
  if (professions.length < initialLength) {
    saveManagedProfessions(professions);
    return true;
  }
  return false;
};


// --- Specialty Management ---

export const getManagedSpecialties = (): Specialty[] => {
  const stored = localStorage.getItem(MANAGED_SPECIALTIES_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing managed specialties from localStorage", e);
      return [...MOCK_SPECIALTIES_FALLBACK]; 
    }
  }
  return [...MOCK_SPECIALTIES_FALLBACK]; 
};

export const saveManagedSpecialties = (specialties: Specialty[]): void => {
  localStorage.setItem(MANAGED_SPECIALTIES_STORAGE_KEY, JSON.stringify(specialties));
};

export const addSpecialty = (specialty: Omit<Specialty, 'id'>): Specialty => {
  const specialties = getManagedSpecialties();
  const newSpecialty: Specialty = { 
    ...specialty, 
    id: `spec_${Date.now()}_${Math.random().toString(16).slice(2)}` 
  };
  specialties.push(newSpecialty);
  saveManagedSpecialties(specialties);
  return newSpecialty;
};

export const updateSpecialty = (updatedSpecialty: Specialty): Specialty | null => {
  let specialties = getManagedSpecialties();
  const index = specialties.findIndex(s => s.id === updatedSpecialty.id);
  if (index !== -1) {
    specialties[index] = updatedSpecialty;
    saveManagedSpecialties(specialties);
    return updatedSpecialty;
  }
  return null;
};

export const deleteSpecialty = (specialtyId: string): boolean => {
  let specialties = getManagedSpecialties();
  const initialLength = specialties.length;
  specialties = specialties.filter(s => s.id !== specialtyId);
  if (specialties.length < initialLength) {
    saveManagedSpecialties(specialties);
    return true;
  }
  return false;
};

// --- Service Category Management ---

export const getManagedCategories = (): ProfessionCategory[] => {
  const stored = localStorage.getItem(MANAGED_CATEGORIES_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing managed categories from localStorage", e);
      return [...MOCK_PROFESSION_CATEGORIES]; // Fallback to hardcoded mocks on error
    }
  }
  return [...MOCK_PROFESSION_CATEGORIES]; // Fallback to hardcoded mocks if not found
};

export const saveManagedCategories = (categories: ProfessionCategory[]): void => {
  localStorage.setItem(MANAGED_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
};

export const addCategory = (category: Omit<ProfessionCategory, 'id'>): ProfessionCategory => {
  const categories = getManagedCategories();
  const newCategory: ProfessionCategory = { 
    ...category, 
    id: `cat_${Date.now()}_${Math.random().toString(16).slice(2)}` 
  };
  categories.push(newCategory);
  saveManagedCategories(categories);
  return newCategory;
};

export const updateCategory = (updatedCategory: ProfessionCategory): ProfessionCategory | null => {
  let categories = getManagedCategories();
  const index = categories.findIndex(c => c.id === updatedCategory.id);
  if (index !== -1) {
    categories[index] = updatedCategory;
    saveManagedCategories(categories);
    return updatedCategory;
  }
  return null;
};

export const deleteCategory = (categoryId: string): boolean => {
  let categories = getManagedCategories();
  const initialLength = categories.length;
  categories = categories.filter(c => c.id !== categoryId);
  if (categories.length < initialLength) {
    saveManagedCategories(categories);
    return true;
  }
  return false;
};
