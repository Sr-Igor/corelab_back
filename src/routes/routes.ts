import { Router } from "express"
import { ping } from "../controllers/PingController"
import * as CrudController from "../controllers/CrudController"

const router = Router()

router.get("/ping", ping)
router.get("/allCars", CrudController.getCars)
router.post("/add", CrudController.create)
router.put("/edit/:id", CrudController.edit)
router.delete("/del/:id", CrudController.destroy)
router.post("/fav/:id", CrudController.favorite)
router.get("/search", CrudController.search)
router.get("/colors", CrudController.getColors)
router.get("/years", CrudController.getYears)
router.get("/brands", CrudController.getBrands)
export default router