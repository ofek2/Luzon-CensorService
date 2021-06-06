import EventEmitter from "events";

enum EventsTypes {
    DalInitializedSuccessfully = "DalInitializedSuccessfully",
    ScriptManagerDone = "ScriptManagerDone",
    ScriptManagerError = "ScriptManagerError",
    GlobalStoreInitialized = "GlobalStoreInitialized",
    StartScripts = "StartScripts",
    ScriptsExecutionDone = "ScriptsExecutionDone"
}

type ObserverFunction = (event: EventsTypes) => void;

class ClickApiEventsEmitter extends EventEmitter {
}

const eventEmitter = new ClickApiEventsEmitter()

export { EventsTypes, eventEmitter }