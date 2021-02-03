import _ from "lodash";
import { Item, List, User, UserDoc } from "../models";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

// Original task items
const item1 = new Item({
  task: "Welcome to your todo list",
  completed: false,
});
const item2 = new Item({
  task: "Hit the + button to add a new item",
  completed: false,
});
const item3 = new Item({
  task: "Hit the delete button to delete an item",
  completed: false,
});
const item4 = new Item({
  task: "Tap the task name to go back to all your tasks",
  completed: false,
});
const item5 = new Item({
  task: "Tap the moon icon to switch between dark and light modes",
  completed: false,
});

const defaultItems = [item1, item2, item3, item4, item5];

// @desc prevent GET router.route("/robots.txt") and router.route("/favicon.ico")
export const preventFaviconAndRobots = (req: Request, res: Response) => {
  res.type("text/plain");
  res.send("User-agent: *\nDisallow: /");
};

// @desc GET router.route("/")
export const getLists = async (req: Request, res: Response) => {
  try {
    if (req.session.user) {
      // If user session exists
      const user: UserDoc = await User.findOne({ uuid: req.session.user.uuid });
      const lists = user.lists;
      return res.status(200).json({
        lists,
      });
    } else {
      // If no user session exists, create user and user session
      req.session.user = { uuid: uuidv4() };
      const newUser = await User.create({
        uuid: req.session.user.uuid,
        lists: [],
      });
      const lists = newUser.lists;
      return res.status(200).json({
        lists,
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc GET router.route("/:customListName")
export const getListItems = async (req: Request, res: Response) => {
  const customListName = _.startCase(req.params.customListName);
  try {
    if (req.session.user) {
      // If user session exists
      // Find a user that has a list with the customListName, return null if not found
      const user: UserDoc = await User.findOne(
        {
          uuid: req.session.user.uuid,
          "lists.name": customListName,
        },
        // Return the user but only return it with one list (the list with customListName)
        { "lists.$": 1 }
      );
      if (user) {
        // If user with the customListName exists
        const foundList = user.lists[0];
        // Select the list
        return res.status(200).json({
          listTitle: foundList.name,
          items: foundList.items,
        });
      } else {
        // If user with customListName doesn't exist
        const newList = new List({
          name: customListName,
          items: defaultItems,
        });
        const user: UserDoc = await User.findOne({
          uuid: req.session.user.uuid,
        });
        user.lists.push(newList);
        await user.save();
        return res.status(201).json({
          listTitle: newList.name,
          items: newList.items,
        });
      }
    } else {
      // If no user session exists, create user and user session
      req.session.user = { uuid: uuidv4() };
      await User.create({
        uuid: req.session.user.uuid,
        lists: [],
      });
      res.redirect("/");
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc POST router.route("/:customListName")
export const addListItem = async (req: Request, res: Response) => {
  const itemName = req.body.text;
  const item = new Item({
    task: itemName,
    completed: false,
  });
  const customListName = _.startCase(req.params.customListName);
  try {
    // Find the current user, the current list, and push the new item into its items array
    await User.findOneAndUpdate(
      { uuid: req.session.user.uuid, "lists.name": customListName },
      { $push: { "lists.$.items": item } }
    );
    return res.status(201).json({
      item,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc DELETE router.route("/:id")
export const deleteList = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await User.findOneAndUpdate(
      { uuid: req.session.user.uuid },
      { $pull: { lists: { _id: id } } }
    );
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc DELETE router.route("/:customListName/:id")
export const deleteListItem = async (req: Request, res: Response) => {
  const customListName = _.startCase(req.params.customListName);
  const id = req.params.id;
  try {
    await User.findOneAndUpdate(
      { uuid: req.session.user.uuid, "lists.name": customListName },
      { $pull: { "lists.$.items": { _id: id } } }
    );
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc PATCH router.route("/:customListName/:id")
export const toggleItemCompleted = async (req: Request, res: Response) => {
  const customListName = _.startCase(req.params.customListName);
  const id = req.params.id;
  const completed = req.body.completed;
  try {
    await User.findOneAndUpdate(
      {
        uuid: req.session.user.uuid,
      },
      {
        $set: {
          "lists.$[currentList].items.$[currentItem].completed": completed,
        },
      },
      {
        arrayFilters: [
          { "currentList.name": customListName },
          { "currentItem._id": id },
        ],
      }
    );
    const user: UserDoc = await User.findOne(
      { uuid: req.session.user.uuid, "lists.name": customListName },
      { "lists.$": 1 }
    );
    const newList = user.lists[0];
    return res.status(200).json({
      items: newList.items,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
