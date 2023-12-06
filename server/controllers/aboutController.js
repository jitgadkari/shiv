const About = require("../models/AboutModel")

module.exports.createAboutSection = async (req, resp, next) => {
    const { title, text } = req.body;
    const data = await About.create({ title, text })
    console.log(data);
    resp.json(data);
}
module.exports.getAboutSection = async (req, resp, next) => {
    const data = await About.find().sort({ createdAt: -1 })

    resp.json(data);
}
module.exports.updateAboutSection = async (req, resp, next) => {
    const { photo } = req.body;
    const foundAboutSection = await About.findOne({});
    if (foundAboutSection) {
        const data = await About.findOneAndUpdate({}, { $push: { slides: { photo } } });
        data.save();
        resp.json({ data, msg: "successfully Updated", status: true });
    } else {
        const data = await About.create({ photo });
        if (data) {
            const updatedata = await About.findOneAndUpdate({}, { $push: { slides: { photo } } })
            updatedata.save();
            resp.json({ updatedata, msg: "successfully Updated", status: true })
        }
    }
}
module.exports.updateMemberSection = async (req, resp, next) => {
    const { name, profile } = req.body;
    const foundAboutSection = await About.findOne({});
    if (foundAboutSection) {
        const data = await About.findOneAndUpdate({}, { $push: { members: { name, profile } } });
        data.save();
        resp.json({ data, msg: "successfully Updated", status: true });
    } else {
        const data = await About.create({ name, profile })
        if (data) {
            const updateddata = await About.findOneAndUpdate({}, { $push: { members: { name, profile } } });
            updateddata.save();
            resp.json({ updateddata, msg: "successfully Updated", status: true })
        }
    }
}

module.exports.updateTextTitleAboutSection = async (req, resp, next) => {
    const { title, text } = req.body;
    const foundAboutSection = await About.findOne({});
    if (foundAboutSection) {
        const data = await About.findOneAndUpdate({}, { $set: { text: text, title: title } });
        data.save();
        resp.json({ data, msg: "successfully Updated", status: true });
    } else {
        const data = await About.create({ title, text })
        // console.log(data);
        if (data) {
            const updatedata = await About.findOneAndUpdate({}, { $set: { text: text, title: title } });
            updatedata.save();
            resp.json({ updatedata, msg: "successfully Updated", status: true })
        }
    }

}

module.exports.deleteSlide = async (req, resp, next) => {
    try {
        const slideId = req.params.slideId;
        const aboutId = req.params.aboutId;


        const foundAbout = await About.findById(aboutId);
        if (foundAbout) {
            const foundSlide = foundAbout.slides.find(slide => slide._id.toString() === slideId);
            if (!foundSlide) {
                resp.json({ status: false, msg: "Could not found slide" });
            }
            if (foundSlide) {
                foundAbout.slides = foundAbout.slides.filter(slide => slide._id.toString() !== slideId);
                const result = await foundAbout.save();
                resp.json({ status: true, msg: "slide deleted successfully", result });
            }
        } else {
            resp.json({ status: false, msg: "Slide not found" })
        }
    } catch (ex) {
        next(ex);
    }
}
module.exports.deleteMember = async (req, resp, next) => {
    try {
        const memberId = req.params.memberId;
        const aboutId = req.params.aboutId;


        const foundAbout = await About.findById(aboutId);
        if (foundAbout) {
            const foundMember = foundAbout.members.find(member => member._id.toString() === memberId);
            if (!foundMember) {
                resp.json({ status: false, msg: "Could not found member" });
            }
            if (foundMember) {
                foundAbout.members = foundAbout.members.filter(member => member._id.toString() !== memberId);
                const result = await foundAbout.save();
                resp.json({ status: true, msg: "member deleted successfully", result });
            }
        } else {
            resp.json({ status: false, msg: "member not found" })
        }
    } catch (ex) {
        next(ex);
    }
}
