
import { WebSocketServer } from "ws";
import { updateStockPrices, currentStocks, updateMutualFundPrices, currentMutualFunds } from "./data";

export const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws : WebSocket) => {
  console.log("Client connected ✅");

  
  ws.send(
    JSON.stringify({
      type: "init-stocks",
      stocks: currentStocks,
      mutualFunds: currentMutualFunds,
    })
  );
  ws.send(
    JSON.stringify({
      type: "init-funds",
      stocks: currentStocks,
      mutualFunds: currentMutualFunds,
    })
  );

  
  const interval = setInterval(() => {
    updateStockPrices();
    updateMutualFundPrices();

    ws.send(
      JSON.stringify({
        type: "update-stocks",
        stocks: currentStocks,
        mutualFunds: currentMutualFunds,
      })
    );
    
    ws.send(
      JSON.stringify({
        type: "update-funds",
        
        mutualFunds: currentMutualFunds,
      })
    );
  },10 * 1000);
//@ts-ignore
  ws.on("close", () => {
    console.log("Client disconnected ❌");
    clearInterval(interval);
  });
});


