import { realtime } from "@/constants";
import { RealtimeChannel } from "ably";

export class WaitingRoomManager {
  private channel: RealtimeChannel;
  private channelName: string;
  private isSubscribed: boolean = false;

  constructor(channelName: string = "waiting-room") {
    this.channelName = channelName;
    this.channel = realtime.channels.get(this.channelName);
    this.init();
  }

  /**
   * Initializes the waiting room manager
   */
  private async init() {
    try {
      await this.enterRoom();
      await this.subscribeToRoomEvents();
    } catch (error) {
      console.error(`Error initializing WaitingRoomManager: ${error}`);
    }
  }

  /**
   * Enter the waiting room
   */
  async enterRoom() {
    try {
      await this.channel.presence.enter();
      console.log(`[${this.channelName}] Entered the room.`);
    } catch (error) {
      console.error(`[${this.channelName}] Failed to enter room:`, error);
    }
  }

  /**
   * Leave the waiting room
   */
  async leaveRoom() {
    try {
      await this.channel.presence.leave();
      console.log(`[${this.channelName}] Left the room.`);
    } catch (error) {
      console.error(`[${this.channelName}] Failed to leave room:`, error);
    }
  }

  /**
   * Get the number of members in the waiting room
   */
  async getRoomMembers(): Promise<number> {
    try {
      const presenceSet = await this.channel.presence.get();
      console.log(`[${this.channelName}] Total members: ${presenceSet.length}`);
      return presenceSet.length;
    } catch (error) {
      console.error(
        `[${this.channelName}] Error fetching room members:`,
        error
      );
      return 0;
    }
  }

  /**
   * Subscribes to presence events (enter/leave)
   */
  async subscribeToRoomEvents() {
    if (this.isSubscribed) return;
    this.isSubscribed = true;

    this.channel.presence.subscribe("enter", async (member) => {
      try {
        const totalMembers = await this.getRoomMembers();
        console.log(`[${this.channelName}] Member joined: ${member.clientId}`);
        console.log(`[${this.channelName}] Total members: ${totalMembers}`);
      } catch (error) {
        console.error(
          `[${this.channelName}] Error processing member join:`,
          error
        );
      }
    });

    this.channel.presence.subscribe("leave", async (member) => {
      try {
        console.log(`[${this.channelName}] Member left: ${member.clientId}`);
      } catch (error) {
        console.error(
          `[${this.channelName}] Error processing member leave:`,
          error
        );
      }
    });

    console.log(`[${this.channelName}] Subscribed to room events.`);
  }

  /**
   * Unsubscribes from presence events
   */
  unsubscribeFromRoomEvents() {
    if (!this.isSubscribed) return;
    this.isSubscribed = false;

    this.channel.presence.unsubscribe("enter");
    this.channel.presence.unsubscribe("leave");

    console.log(`[${this.channelName}] Unsubscribed from room events.`);
  }
}
