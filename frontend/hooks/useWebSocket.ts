"use client";

import { useEffect, useState } from "react";

interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
}

interface Fund {
  symbol: string;
  fund: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
}

interface WSData {
  type: "init-stocks" |"init-funds" | "update-stocks" | "update-funds";
  stocks: Stock[];
  mutualFunds: Fund[];
}

export const useWebSocketData = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const data: WSData = JSON.parse(event.data);

      if (data.type === "init-stocks") {
        // Initial snapshot
        setStocks(data.stocks);
    
      } else if (data.type === "init-funds") {
        // Updates every 10s
        
        setFunds(data.mutualFunds);
      }
      else if (data.type === "update-stocks") {
        // Updates every 10s
        setStocks(data.stocks);
      } else {
        // Updates every 10s
        setFunds(data.mutualFunds);
      }
    };

    ws.onclose = () => {
      console.log("❌ Disconnected from WebSocket");
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  return { stocks, funds, connected };
};
