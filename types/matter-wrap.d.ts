declare module 'matter-wrap' {
    import * as Matter from 'matter-js';

    const MatterWrap: {
        name: string;
        version: string;
        for: string;
        install: (base: typeof Matter) => void;
        plugin: {
            wrap: (body: Matter.Body) => void;
        };
    };

    export default MatterWrap;
}