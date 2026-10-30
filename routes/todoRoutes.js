
const express = require("express");
const router = express.Router();

const Todo = require("../models/Todo");

// POST: Create a new Todo
router.post("/", async (req, res) => {
    try {
        const { title, description, completed } = req.body;

        const newTodo = new Todo({
            title,
            description,
            completed
        });

        const savedTodo = await newTodo.save();

        res.status(201).json({
            success: true,
            message: "Todo created successfully!",
            data: savedTodo
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


// GET: Get all Todos
router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find();

        res.status(200).json({
            success: true,
            count: todos.length,
            data: todos
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// GET: Get a single Todo
router.get("/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found!"
            });
        }

        res.status(200).json({
            success: true,
            data: todo
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid Todo ID"
        });
    }
});


// PUT: Update a Todo
router.put("/:id", async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found!"
            });
        }

        res.status(200).json({
            success: true,
            message: "Todo updated successfully!",
            data: updatedTodo
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


// DELETE: Delete a Todo
router.delete("/:id", async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(
            req.params.id
        );

        if (!deletedTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found!"
            });
        }

        res.status(200).json({
            success: true,
            message: "Todo deleted successfully!",
            data: deletedTodo
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid Todo ID"
        });
    }
});

module.exports = router;
