import { Route, BrowserRouter, Routes, Link } from "react-router-dom";
import { ROUTES } from "../const/Routes";

import WarframePage from "./Warframe";
import MainPage from "./Main";
import FormPage from "./FormPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<MainPage />} />
        <Route path={ROUTES.ITEM} element={<WarframePage />} />
        <Route path={ROUTES.FORM} element={<FormPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
