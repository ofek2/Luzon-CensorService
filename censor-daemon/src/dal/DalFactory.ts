import { IDalComposer } from "../interfaces/dal/IDalComposer";
import { MongoComposer } from "./mongo/MongoComposer";

/**
 * A factory for creating data access composer object.
 * This class is used like a singletone class,
 * In order to use the dal of the storage we need to import the dalFactory instace and use the DalComposer property
 */
class DalFactory {
    /**
     * Private class members
     */
    private dalComposer: IDalComposer;

    /**
     * 
     * @param type the database type of the DalComposer object
     * @param configuration the configuration needed to the specifyc type
     * @returns Promise of dal composer initialization
     */
    public initialize(type: "mongo" | string, configuration: any): Promise<string> {
        let succeedPromise;

        try {
            switch (type) {
                case "mongo":
                default:
                    this.dalComposer = new MongoComposer();
                    succeedPromise = this.dalComposer.initialize(configuration);

                    break;
            }
        } catch(error) {
            succeedPromise = new Promise<string>((resolve, reject) => reject(error));
        }

        return succeedPromise;
    }

    /**
     * The DalComposer property getter
     */
    public get DalComposer(): IDalComposer {
        return this.dalComposer;
    }
}

const dalFactory = new DalFactory();

export { dalFactory }