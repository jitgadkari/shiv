
const { createAboutSection, getAboutSection,updateAboutSection,updateMemberSection, updateTextTitleAboutSection,deleteSlide, deleteMember } = require("../controllers/aboutController");
const express=require("express");
const aboutRouter=express.Router();
const authMiddleware=require("../middleware/auth")


aboutRouter.post("api/createAboutSection",authMiddleware, createAboutSection);
aboutRouter.get("api/getAboutSection",getAboutSection);
aboutRouter.patch("api/updateAboutSection",authMiddleware,updateAboutSection);
aboutRouter.patch("api/updateMemberSection",authMiddleware,updateMemberSection);
aboutRouter.patch("api/updateTextTitleAboutSection",authMiddleware,updateTextTitleAboutSection);
aboutRouter.delete("api/:slideId/:aboutId",authMiddleware,deleteSlide);
aboutRouter.delete("api/member/:aboutId/:memberId",authMiddleware,deleteMember);

module.exports= aboutRouter;