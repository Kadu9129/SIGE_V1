import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Placeholder legado para compatibilidade; a app usa rotas standalone em app.routes.ts
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
