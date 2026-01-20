"use client";

import { ControllerFieldState } from "react-hook-form";
import { FieldError } from "./field";

interface FormErrorProps {
    fieldState: ControllerFieldState;
}

export function FormError({ fieldState }: FormErrorProps) {
    if (!fieldState.error) return null;

    if (fieldState.error.types) {
        return (
            <div className="flex flex-col error-container gap-1 mt-1.5">
                {Object.entries(fieldState.error.types).map(([type, messages]) => {
                    const messagesArray = (
                        Array.isArray(messages) ? messages : [messages]
                    ).filter((msg): msg is string => typeof msg === "string");

                    return messagesArray.map((msg, index) => (
                        <div key={`${type}-${index}`} className="flex items-center gap-1.5">
                            <span className="text-slate-400 dark:text-slate-600 text-[10px]">
                                •
                            </span>
                            <FieldError errors={[{ message: msg }]} />
                        </div>
                    ));
                })}
            </div>
        );
    }

    return (
        <div className="flex flex-col error-container gap-1 mt-1.5">
            <div className="flex items-center gap-1.5">
                <span className="text-slate-400 dark:text-slate-600 text-[10px]">
                    •
                </span>
                <FieldError errors={[{ message: fieldState.error.message }]} />
            </div>
        </div>
    );
}
