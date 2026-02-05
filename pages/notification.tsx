// pages/notification.tsx
import React, { Component } from "react";
import Navbar from "../components/Navbar";

// Define the shape of a notification
interface Notification {
  message: string;
}

// Define state type
interface NotificationState {
  notifications: Notification[];
}

export default class NotificationPopup extends Component<{}, NotificationState> {
  state: NotificationState = {
    notifications: [],
  };

  ws!: WebSocket; // WebSocket instance

  componentDidMount() {
    this.ws = new WebSocket("ws://localhost:8080");

    this.ws.onmessage = (event: MessageEvent) => {
      const data: Notification = JSON.parse(event.data);

      this.setState((prev) => ({
        notifications: [...prev.notifications, data],
      }));

      // Remove notification after 5 seconds
      setTimeout(() => {
        this.setState((prev) => ({
          notifications: prev.notifications.filter((n) => n !== data),
        }));
      }, 5000);
    };
  }

  componentWillUnmount() {
    if (this.ws) this.ws.close();
  }

  render() {
    return (
      <div>
        <Navbar />
        <div style={{ padding: 20 }}>
          <h2>WebSocket Notifications</h2>
        </div>

        {/* Popup container */}
        <div
          style={{
            position: "fixed",
            top: 10,
            right: 10,
            zIndex: 9999,
          }}
        >
          {this.state.notifications.map((n, idx) => (
            <div
              key={idx}
              style={{
                background: "#333",
                color: "#fff",
                padding: "10px 20px",
                marginBottom: 10,
                borderRadius: 5,
                boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
              }}
            >
              {n.message}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
