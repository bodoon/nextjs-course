import { useEffect, useState } from "react";
import styles from "./contact-form.module.css";
import Notification from "../ui/notification";

async function sentContactData(contactDetails) {
  const response = await fetch("/api/contact", {
    method: "POST",
    body: JSON.stringify(contactDetails),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
}

function ContactForm() {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredName, setEnteredName] = useState("");
  const [enteredMessage, setEnteredMessage] = useState("");
  const [requestStatus, setRequestStatus] = useState(null); //pending, success, error

  useEffect(() => {
    if (requestStatus && requestStatus !== "pending") {
      const timer = setTimeout(() => {
        setRequestStatus(null);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [requestStatus]);

  async function submitHandler(e) {
    e.preventDefault();

    setRequestStatus("pending");

    const contactDetails = {
      email: enteredEmail,
      name: enteredName,
      message: enteredMessage,
    };

    try {
      await sentContactData(contactDetails);
    } catch (error) {
      setRequestStatus("error");
      return;
    }

    setRequestStatus("success");
    resetFormData();
  }

  function resetFormData() {
    setEnteredEmail("");
    setEnteredMessage("");
    setEnteredName("");
  }

  let notification;

  if (requestStatus === "success") {
    notification = {
      status: requestStatus,
      title: "Success",
      message: "Message sent successfully",
    };
  }

  if (requestStatus === "pending") {
    notification = {
      status: requestStatus,
      title: "Pending",
      message: "Message is being sent",
    };
  }

  if (requestStatus === "error") {
    notification = {
      status: requestStatus,
      title: "Error",
      message: "Something went wrong",
    };
  }

  return (
    <section className={styles.contact}>
      <h1>How can I help you?</h1>
      <form className={styles.form} onSubmit={submitHandler}>
        <div className={styles.controls}>
          <div className={styles.control}>
            <label htmlFor="email">Your email</label>
            <input
              type="email"
              id="email"
              required
              value={enteredEmail}
              onChange={(e) => setEnteredEmail(e.target.value)}
            />
          </div>
          <div className={styles.control}>
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              required
              value={enteredName}
              onChange={(e) => setEnteredName(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.control}>
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            id="message"
            rows="5"
            value={enteredMessage}
            onChange={(e) => setEnteredMessage(e.target.value)}
          />
        </div>
        <div className={styles.actions}>
          <button>send message</button>
        </div>
      </form>
      {notification && <Notification {...notification} />}
    </section>
  );
}

export default ContactForm;
