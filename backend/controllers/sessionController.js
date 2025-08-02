const Session = require("../models/Session");
const Question = require("../models/Question");

//@desc Create a new session and linked questions
//@route POST /api/sessions/create
//@access Private
exports.createSession = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, description, questions } = 
            req.body;
        const userId = req.user._id; //Assuming you have a middleware that sets req.user

        const session = await Session.create({
            user: req.user._id,
            role,
            experience,
            topicsToFocus,
            description
        });

        const questionDocs = await Promise.all(
            questions.map(async (q) => {
                const question = await Question.create({
                    session: session._id,
                    text: q.text,
                    answer: q.answer
                });
                return question._id;
            })
        );

        session.questions = questionDocs;
        await session.save();

        res.status(201).json({success: true, session });
    }catch (error) {
        res.status(500).json({success : false, message: "Server error" });
    }
};

//@desc Get all sessions for the logged-in user
//@route GET /api/sessions/my-sessions
//@access Private
exports.getMySessions = async (req, res) => {
      try {
        const sessions = await Session.find({ user: req.user.id })
            .populate("questions")
            .sort({ createdAt: -1 });
        res.status(200).json({  sessions });
    }catch (error) {
        res.status(500).json({success : false, message: "Server error" });
    }
};

//@desc Get session by ID with populated questions
//@route GET /api/sessions/:id
//@access Private
exports.getSessionById = async (req, res) => {
      try {
        const session = await Session.findById(req.params.id)
            .populate({
                path: "questions",
                options: { sort: { isPinned:-1,createdAt: -1 } } ,
            })
            .exec();
            
        if (!session) {
            return res
            .status(404)
            .json({ success:false, message: "Session not found" });
        }

        res.status(200).json({ success: true, session });
    }catch (error) {
        res.status(500).json({success : false, message: "Server error" });
    }
};

//@desc Delete a session and its linked questions
//@route DELETE /api/sessions/:id
//@access Private
exports.deleteSession = async (req, res) => {
      try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({  message: "Session not found" });
        }

        //check if logged-in user is the owner of the session
        if (session.user.toString() !== req.user.id) {
            return  res
            .status(401)
            .json({ message: "Not authorized to delete this session" });
        }

        // first , delete all linked questions
        await Question.deleteMany({ session: session._id });

        // Delete the session
        await session.remove();

        res.status(200).json({  message: "Session deleted successfully" });
    }catch (error) {
        res.status(500).json({success : false, message: "Server error" });
    }
};
    