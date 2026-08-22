// Side-effect imports so every schema is registered with Mongoose before any
// query does a .populate() on it — populate() throws MissingSchemaError if the
// referenced model hasn't been imported yet somewhere in the current process.
import "./User.js";
import "./Admin.js";
import "./Category.js";
import "./Product.js";
import "./Review.js";
import "./Order.js";
import "./BlogPost.js";
