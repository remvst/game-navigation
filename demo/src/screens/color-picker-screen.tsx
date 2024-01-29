import { Resolver, UserCancelledError } from "@remvst/game-navigation-core";
import { ReactScreen } from "@remvst/game-navigation-react";
import React from "react";

export class ColorPickerScreen extends ReactScreen {

    resolver: Resolver<number>;

    get id(): string {
        return 'color-picker';
    }

    async rootComponent(): Promise<React.ReactElement> {
        return (<div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
            <h1>Pick a square color</h1>
            <button onClick={() => this.resolver.resolve(0xff0000)}>red square</button>
            <button onClick={() => this.resolver.resolve(0x0000ff)}>blue square</button>
            <button onClick={() => this.resolver.reject(new UserCancelledError())}>cancel</button>
        </div>);
    }

    get absorbCycle() {
        return false;
    }
}
