import { Resolver } from "@remvst/game-navigation-core";
import { ReactScreen } from "@remvst/game-navigation-react";
import React, { ReactElement, JSXElementConstructor } from "react";

export class ColorPickerScreen extends ReactScreen {

    resolver: Resolver<number>;

    get id(): string {
        return 'color-picker';
    }

    async rootComponent(): Promise<ReactElement<any, string | JSXElementConstructor<any>>> {
        return (<div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            color: 'white',
        }}>
            <h1>Menu</h1>
            <button onClick={() => this.resolver.resolve(0xff0000)}>red square</button>
            <button onClick={() => this.resolver.resolve(0x0000ff)}>blue square</button>
        </div>);
    }
}
