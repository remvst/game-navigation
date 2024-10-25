import { Resolver } from "@remvst/game-navigation-core";
import { ReactScreen } from "@remvst/game-navigation-react";
import React from "react";
import { KEY_BINDINGS } from "../key-binding-settings";

export class InstructionsScreen extends ReactScreen {
    resolver: Resolver<number>;

    readonly id = "color-picker";

    async rootComponent(): Promise<React.ReactElement> {
        const settings = KEY_BINDINGS;

        return (
            <div
                style={{
                    color: "white",
                    position: "relative",
                    width: "100%",
                    height: "100%",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                    }}
                >
                    {settings.definitionSet.definitions.map((bindingDef) => {
                        return (
                            <div>
                                {bindingDef.label}:{" "}
                                {settings
                                    .binding(bindingDef.key)
                                    .bindings.map((binding) => {
                                        return binding.label;
                                    })
                                    .join(" / ")}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
