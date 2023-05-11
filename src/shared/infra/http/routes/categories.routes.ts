import { Router, request, response } from "express"
import multer from "multer"

import { ImportCategoryController } from "@modules/cars/useCases/importCategory/ImportCategoryController"
import { CreateCategoryController } from "@modules/cars/useCases/createCategory/CreateCategoryController"
import { ListCategoriesController } from "@modules/cars/useCases/listCategories/ListCategoriesController"
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated"
import { ensureAdmin } from "../middlewares/ensureAdmin"

const categoriesRoutes = Router()

const upload = multer({
    dest: "./tmp"
})

const createCategoryController = new CreateCategoryController()
const importCategoryController = new ImportCategoryController()
const listCategoriesController = new ListCategoriesController()

categoriesRoutes.post("/", ensureAuthenticated, ensureAdmin, createCategoryController.handle)

categoriesRoutes.get("/", listCategoriesController.handle)

categoriesRoutes.post("/import", upload.single("file"), ensureAuthenticated, ensureAdmin, importCategoryController.handle)


export { categoriesRoutes }