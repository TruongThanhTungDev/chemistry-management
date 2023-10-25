import { Routes } from "@angular/router";
import { ChemistryManagement } from "../pages/chemistry-management/chemistry-management.component";
import { ImportChemistry } from "../pages/import-chemistry/import-chemistry.component";

export const LayoutRoutes: Routes = [
  {
    path: '',
    component: ChemistryManagement
  },
  {
    path: 'import-chemistry',
    component: ImportChemistry
  }
]