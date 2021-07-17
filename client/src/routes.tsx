import { HashRouter, Route, Switch } from "react-router-dom";
import React from "react";
import { WalletProvider } from "./contexts/wallet";
import { ConnectionProvider } from "./contexts/connection";
import { AccountsProvider } from "./contexts/accounts";
import { MarketProvider } from "./contexts/market";
import { PriceProvider } from "./contexts/price";
import { RoksAccountProvider } from "./contexts/roksAccount";
import { AppLayout } from "./components/Layout";

import { FaucetView, HomeView } from "./views";

export function Routes() {
  return (
    <>
      <HashRouter basename={"/"}>
        <ConnectionProvider>
          <WalletProvider>
            <AccountsProvider>
              <MarketProvider>
                <AppLayout>
                  <PriceProvider>
                    <RoksAccountProvider>
                      <Switch>
                        <Route exact path="/" component={() => <HomeView />} />
                        <Route exact path="/faucet" children={<FaucetView />} />
                        <Route exact path="*" component={() => <HomeView />} />
                      </Switch>
                    </RoksAccountProvider>
                  </PriceProvider>
                </AppLayout>
              </MarketProvider>
            </AccountsProvider>
          </WalletProvider>
        </ConnectionProvider>
      </HashRouter>
    </>
  );
}
