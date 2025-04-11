import { useState } from "react";
import { motion } from "framer-motion";
import swal from "sweetalert2";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    if (!formData.rating) errs.rating = "Please select a rating";
    if (!formData.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      swal.fire({
        title: "Form Incomplete",
        text: "Please fill all the required fields.",
        icon: "warning",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        swal.fire({
          title: "Thank You!",
          text: result.message,
          icon: "success",
        });
        setFormData({ name: "", email: "", rating: "", message: "" });
        setErrors({});
      } else {
        swal.fire({
          title: "Error",
          text: result.message || "Failed to submit feedback.",
          icon: "error",
        });
      }
    } catch (err) {
      swal.fire({
        title: "Something went wrong",
        text: "Please try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto p-6 rounded-2xl shadow-2xl bg-white dark:bg-gray-900"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Share Your Feedback
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className={`w-full p-3 rounded-lg border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } dark:bg-gray-800 dark:text-white`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`w-full p-3 rounded-lg border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } dark:bg-gray-800 dark:text-white`}
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
            Rating
          </label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg border ${
              errors.rating ? "border-red-500" : "border-gray-300"
            } dark:bg-gray-800 dark:text-white`}
          >
            <option value="">Select a rating</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
            Message
          </label>
          <textarea
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your feedback..."
            className={`w-full p-3 rounded-lg border ${
              errors.message ? "border-red-500" : "border-gray-300"
            } dark:bg-gray-800 dark:text-white`}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </motion.div>
  );
};

export default Feedback;
