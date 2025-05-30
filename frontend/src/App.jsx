import { useState, useEffect } from "react";
import { Paperclip, Mic, CornerDownLeft, Sparkles } from "lucide-react";
import { TextEffect } from "./components/ui/text-effect";
import { Button } from "./components/ui/button";
import { StarsBackground } from "./components/ui/stars";
import { ShootingStars } from "./components/ui/shooting-stars";
import { ChatMessageList } from "./components/ui/chat-message-list";
import { ChatInput } from "./components/ui/chat-input";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "./components/ui/chat-bubble";

function App() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const wsUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace('http', 'ws');
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log("Connected to server");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };

    ws.onclose = () => {
      console.log("Disconnected from server");
      setSocket(null);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [setSocket]);

  return (
    <StarsBackground className="min-h-screen relative">
      <ShootingStars
        starColor="#9E00FF"
        trailColor="#2EB9DF"
        minSpeed={15}
        maxSpeed={35}
        minDelay={1000}
        maxDelay={3000}
      />
      <ShootingStars
        starColor="#FF0099"
        trailColor="#FFB800"
        minSpeed={10}
        maxSpeed={25}
        minDelay={2000}
        maxDelay={4000}
      />
      <div className="container mt-16 mx-auto p-4 max-w-2xl h-[80vh] relative z-10 bg-background/10 backdrop-blur-md rounded-lg border border-white/10 shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4">
            <TextEffect
              as="h1"
              per="word"
              preset="slide"
              className="text-2xl font-bold text-gray-500"
            >
              Chat with Nerds
            </TextEffect>
            {/* <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" /> */}
            <span className="text-2xl text-yellow-400 animate-pulse">🏳️‍🌈</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatMessageList>
              {messages.map((msg, index) => (
                <ChatBubble
                  key={index}
                  variant={msg.startsWith('You:') ? "sent" : "received"}
                >
                  <ChatBubbleAvatar
                    className="h-10 w-10 shrink-0"
                    src={msg.startsWith('You:') 
                      ? "https://i.pinimg.com/originals/31/f5/aa/31f5aa7980077832f7aeb31cf4cf3269.jpg"
                      : "https://i.pinimg.com/736x/65/96/1a/65961ada6ca2cc5e35679df4b3e071ec.jpg"
                    }
                    fallback={msg.startsWith('You:') ? "You" : "AI"}
                  />
                  <ChatBubbleMessage
                    variant={msg.startsWith('You:') ? "sent" : "received"}
                  >
                    {msg.startsWith('You:') ? msg.substring(4) : msg}
                  </ChatBubbleMessage>
                </ChatBubble>
              ))}
            </ChatMessageList>
          </div>

          <div className="p-4 border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!message.trim() || !socket) return;
                socket.send(`You: ${message}`);
                setMessage('');
              }}
              className="relative rounded-lg border bg-background/20 focus-within:ring-1 focus-within:ring-ring p-1"
            >
            
              <ChatInput
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="min-h-12 resize-none rounded-lg bg-transparent border-0 p-3 text-white placeholder-gray-400 shadow-none focus-visible:ring-0"
              />
            
              <div className="flex items-center p-3 pt-2 justify-between">
                <div className="flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="text-white hover:text-white/80"
                  >
                    <Paperclip className="size-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="text-white hover:text-white/80"
                  >
                    <Mic className="size-4" />
                  </Button>
                </div>
                <Button type="submit" size="sm" className="ml-auto gap-1.5 bg-white/10 hover:bg-white/20 text-white">
                  Send Message
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </StarsBackground>
  );
}

export default App;
