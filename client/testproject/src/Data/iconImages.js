import { reactive } from 'vue'

/*
    This file is just for storing all the icon SVG data.
    This file is responsible for rendering the SVG and path data ONLY
    This would contain the Vector path of the corresponding values

    Refer to IconData.js of user based manipulation of grid list and icon data container layouts.

    'pathData' refers to the 'd' tag on the <path> element.
    it specifies the math to draw the icon.

    These icons have a specific SVG viewbox, shown on SVGHandler.vue
    Any new icons outside of this pack, will require some form of handling to ensure it has the right data going in.

*/
class IconImages{
    constructor(){ this.baseData(); }
    get allData(){ return this.dataMap; }

    baseData(){

        this.isFirstItemPushed = false;
        this.firstPathData = null;

        this.dataMap = new Map(); 
        this.resetImports();

        /*
            Base
            pathData: {
                d: []
                transforms: ""
            }

            in the event of a tree like SVG structure

            pathData: {
            
                d: [
                    {
                        d: [... ]
                        transforms:"",
                    },
                    {
                        d: []
                        transforms:"",
                    },
                    .
                    .
                    .

                ],
                transforms: "",
            }

            types:

            String -> path tag, actual draw data

            object -> g tag, render a g tag
            apply the transform in the same level if any

                - do the same thing again as above until all path and g tags are applied

        */

        // Social media icons
        // These are taken from: https://icons8.com/icon/set/logos/windows

        this.dataMap.set('Github', {
            pathData: {
                d: ['M 16 4 C 9.371094 4 4 9.371094 4 16 C 4 21.300781 7.4375 25.800781 12.207031 27.386719 C 12.808594 27.496094 13.027344 27.128906 13.027344 26.808594 C 13.027344 26.523438 13.015625 25.769531 13.011719 24.769531 C 9.671875 25.492188 8.96875 23.160156 8.96875 23.160156 C 8.421875 21.773438 7.636719 21.402344 7.636719 21.402344 C 6.546875 20.660156 7.71875 20.675781 7.71875 20.675781 C 8.921875 20.761719 9.554688 21.910156 9.554688 21.910156 C 10.625 23.746094 12.363281 23.214844 13.046875 22.910156 C 13.15625 22.132813 13.46875 21.605469 13.808594 21.304688 C 11.144531 21.003906 8.34375 19.972656 8.34375 15.375 C 8.34375 14.0625 8.8125 12.992188 9.578125 12.152344 C 9.457031 11.851563 9.042969 10.628906 9.695313 8.976563 C 9.695313 8.976563 10.703125 8.65625 12.996094 10.207031 C 13.953125 9.941406 14.980469 9.808594 16 9.804688 C 17.019531 9.808594 18.046875 9.941406 19.003906 10.207031 C 21.296875 8.65625 22.300781 8.976563 22.300781 8.976563 C 22.957031 10.628906 22.546875 11.851563 22.421875 12.152344 C 23.191406 12.992188 23.652344 14.0625 23.652344 15.375 C 23.652344 19.984375 20.847656 20.996094 18.175781 21.296875 C 18.605469 21.664063 18.988281 22.398438 18.988281 23.515625 C 18.988281 25.121094 18.976563 26.414063 18.976563 26.808594 C 18.976563 27.128906 19.191406 27.503906 19.800781 27.386719 C 24.566406 25.796875 28 21.300781 28 16 C 28 9.371094 22.628906 4 16 4 Z'],
                transforms: null,
            },
            viewBox: '0 0 32 32',
        });

        this.dataMap.set('Amazon', {
            pathData: {
                d: ['M16.2,4c-3.3,0-6.9,1.2-7.7,5.3C8.4,9.7,8.7,10,9,10l3.3,0.3c0.3,0,0.6-0.3,0.6-0.6c0.3-1.4,1.5-2.1,2.8-2.1c0.7,0,1.5,0.3,1.9,0.9c0.5,0.7,0.4,1.7,0.4,2.5v0.5c-2,0.2-4.6,0.4-6.5,1.2c-2.2,0.9-3.7,2.8-3.7,5.7c0,3.6,2.3,5.4,5.2,5.4c2.5,0,3.8-0.6,5.7-2.5c0.6,0.9,0.9,1.4,2,2.3c0.3,0.1,0.6,0.1,0.8-0.1v0c0.7-0.6,2-1.7,2.7-2.3c0.3-0.2,0.2-0.6,0-0.9c-0.6-0.9-1.3-1.6-1.3-3.2v-5.4c0-2.3,0.2-4.4-1.5-6C20.1,4.4,17.9,4,16.2,4z M17.1,14.3c0.3,0,0.6,0,0.9,0v0.8c0,1.3,0.1,2.5-0.6,3.7c-0.5,1-1.4,1.6-2.4,1.6c-1.3,0-2.1-1-2.1-2.5C12.9,15.2,14.9,14.5,17.1,14.3z M26.7,22.4c-0.9,0-1.9,0.2-2.7,0.8c-0.2,0.2-0.2,0.4,0.1,0.4c0.9-0.1,2.8-0.4,3.2,0.1s-0.4,2.3-0.7,3.1c-0.1,0.2,0.1,0.3,0.3,0.2c1.5-1.2,1.9-3.8,1.6-4.2C28.3,22.5,27.6,22.4,26.7,22.4z M3.7,22.8c-0.2,0-0.3,0.3-0.1,0.4c3.3,3,7.6,4.7,12.4,4.7c3.4,0,7.4-1.1,10.2-3.1c0.5-0.3,0.1-0.9-0.4-0.7c-3.1,1.3-6.4,1.9-9.5,1.9c-4.5,0-8.8-1.2-12.4-3.3C3.8,22.9,3.7,22.8,3.7,22.8z'],
                transforms: null,
            },
            viewBox: '0 0 32 32',
        });

        this.dataMap.set('Youtube', {
            pathData: {
                d: ['M 16 6 C 12.234375 6 8.90625 6.390625 6.875 6.6875 C 5.195313 6.933594 3.839844 8.199219 3.53125 9.875 C 3.269531 11.300781 3 13.386719 3 16 C 3 18.613281 3.269531 20.699219 3.53125 22.125 C 3.839844 23.800781 5.195313 25.070313 6.875 25.3125 C 8.914063 25.609375 12.253906 26 16 26 C 19.746094 26 23.085938 25.609375 25.125 25.3125 C 26.804688 25.070313 28.160156 23.800781 28.46875 22.125 C 28.730469 20.695313 29 18.605469 29 16 C 29 13.394531 28.734375 11.304688 28.46875 9.875 C 28.160156 8.199219 26.804688 6.933594 25.125 6.6875 C 23.09375 6.390625 19.765625 6 16 6 Z M 16 8 C 19.632813 8 22.878906 8.371094 24.84375 8.65625 C 25.6875 8.78125 26.347656 9.417969 26.5 10.25 C 26.742188 11.570313 27 13.527344 27 16 C 27 18.46875 26.742188 20.429688 26.5 21.75 C 26.347656 22.582031 25.691406 23.222656 24.84375 23.34375 C 22.871094 23.628906 19.609375 24 16 24 C 12.390625 24 9.125 23.628906 7.15625 23.34375 C 6.3125 23.222656 5.652344 22.582031 5.5 21.75 C 5.257813 20.429688 5 18.476563 5 16 C 5 13.519531 5.257813 11.570313 5.5 10.25 C 5.652344 9.417969 6.308594 8.78125 7.15625 8.65625 C 9.117188 8.371094 12.367188 8 16 8 Z M 13 10.28125 L 13 21.71875 L 14.5 20.875 L 21.5 16.875 L 23 16 L 21.5 15.125 L 14.5 11.125 Z M 15 13.71875 L 18.96875 16 L 15 18.28125 Z'],
                transforms: null,
            },
            viewBox: '0 0 32 32',
        });

        this.dataMap.set('Reddit', {
            pathData: {
                d: ['M 18.65625 4 C 16.558594 4 15 5.707031 15 7.65625 L 15 11.03125 C 12.242188 11.175781 9.742188 11.90625 7.71875 13.0625 C 6.945313 12.316406 5.914063 12 4.90625 12 C 3.816406 12 2.707031 12.355469 1.9375 13.21875 L 1.9375 13.25 L 1.90625 13.28125 C 1.167969 14.203125 0.867188 15.433594 1.0625 16.65625 C 1.242188 17.777344 1.898438 18.917969 3.03125 19.65625 C 3.023438 19.769531 3 19.882813 3 20 C 3 22.605469 4.574219 24.886719 6.9375 26.46875 C 9.300781 28.050781 12.488281 29 16 29 C 19.511719 29 22.699219 28.050781 25.0625 26.46875 C 27.425781 24.886719 29 22.605469 29 20 C 29 19.882813 28.976563 19.769531 28.96875 19.65625 C 30.101563 18.917969 30.757813 17.777344 30.9375 16.65625 C 31.132813 15.433594 30.832031 14.203125 30.09375 13.28125 L 30.0625 13.25 C 29.292969 12.386719 28.183594 12 27.09375 12 C 26.085938 12 25.054688 12.316406 24.28125 13.0625 C 22.257813 11.90625 19.757813 11.175781 17 11.03125 L 17 7.65625 C 17 6.675781 17.558594 6 18.65625 6 C 19.175781 6 19.820313 6.246094 20.8125 6.59375 C 21.65625 6.890625 22.75 7.21875 24.15625 7.3125 C 24.496094 8.289063 25.414063 9 26.5 9 C 27.875 9 29 7.875 29 6.5 C 29 5.125 27.875 4 26.5 4 C 25.554688 4 24.738281 4.535156 24.3125 5.3125 C 23.113281 5.242188 22.246094 4.992188 21.46875 4.71875 C 20.566406 4.402344 19.734375 4 18.65625 4 Z M 16 13 C 19.152344 13 21.964844 13.867188 23.9375 15.1875 C 25.910156 16.507813 27 18.203125 27 20 C 27 21.796875 25.910156 23.492188 23.9375 24.8125 C 21.964844 26.132813 19.152344 27 16 27 C 12.847656 27 10.035156 26.132813 8.0625 24.8125 C 6.089844 23.492188 5 21.796875 5 20 C 5 18.203125 6.089844 16.507813 8.0625 15.1875 C 10.035156 13.867188 12.847656 13 16 13 Z M 4.90625 14 C 5.285156 14 5.660156 14.09375 5.96875 14.25 C 4.882813 15.160156 4.039063 16.242188 3.53125 17.4375 C 3.277344 17.117188 3.125 16.734375 3.0625 16.34375 C 2.953125 15.671875 3.148438 14.976563 3.46875 14.5625 C 3.472656 14.554688 3.464844 14.539063 3.46875 14.53125 C 3.773438 14.210938 4.3125 14 4.90625 14 Z M 27.09375 14 C 27.6875 14 28.226563 14.210938 28.53125 14.53125 C 28.535156 14.535156 28.527344 14.558594 28.53125 14.5625 C 28.851563 14.976563 29.046875 15.671875 28.9375 16.34375 C 28.875 16.734375 28.722656 17.117188 28.46875 17.4375 C 27.960938 16.242188 27.117188 15.160156 26.03125 14.25 C 26.339844 14.09375 26.714844 14 27.09375 14 Z M 11 16 C 9.894531 16 9 16.894531 9 18 C 9 19.105469 9.894531 20 11 20 C 12.105469 20 13 19.105469 13 18 C 13 16.894531 12.105469 16 11 16 Z M 21 16 C 19.894531 16 19 16.894531 19 18 C 19 19.105469 19.894531 20 21 20 C 22.105469 20 23 19.105469 23 18 C 23 16.894531 22.105469 16 21 16 Z M 21.25 21.53125 C 20.101563 22.597656 18.171875 23.28125 16 23.28125 C 13.828125 23.28125 11.898438 22.589844 10.75 21.65625 C 11.390625 23.390625 13.445313 25 16 25 C 18.554688 25 20.609375 23.398438 21.25 21.53125 Z'],
                transforms: null,
            },
            viewBox: '0 0 32 32',
        });

        // Symbol icons
        // These are taken from: https://fonts.google.com/icons

        this.dataMap.set('Cross', {
            pathData: {
                d: ['m259-206-52-53 220-221-220-221 52-53 221 221 221-221 52 53-220 221 220 221-52 53-221-221-221 221Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        });

        this.dataMap.set('Question_Mark', {
            pathData: {
                d: ['M479.67-244.67q20.33 0 35.66-15.33 15.34-15.33 15.34-36.14 0-20.81-15.34-35.5-15.33-14.69-36-14.69-20.66 0-35.66 14.64-15 14.64-15 35.88 0 20.48 15.08 35.81 15.09 15.33 35.92 15.33Zm-44.34-148.66H516q0-25.67 7-46.67t37.67-48q27-22 40.16-47.82Q614-561.65 614-594.51q0-57.16-34.86-89.99-34.87-32.83-91.81-32.83-55 0-95.83 30.66-40.83 30.67-58.83 78.1L408-580.33q10.33-26 28.99-42.67 18.66-16.67 44.01-16.67 23 0 38.17 13.94 15.16 13.93 15.16 35.19 0 17.21-11.16 34.87Q512-538 495-524.33q-32 28.33-45.83 55.21-13.84 26.88-13.84 75.79ZM480.09-52Q391-52 313.01-85.42q-77.98-33.41-136.08-91.51-58.1-58.1-91.51-135.99Q52-390.82 52-479.91q0-89.76 33.42-167.74 33.41-77.99 91.4-135.79 58-57.8 135.94-91.51 77.94-33.72 167.09-33.72 89.82 0 167.88 33.67 78.07 33.66 135.82 91.37 57.74 57.71 91.43 135.72 33.69 78.02 33.69 167.91 0 89.18-33.72 167.16-33.71 77.98-91.51 135.99-57.8 58.02-135.69 91.43Q569.85-52 480.09-52ZM480-156.67q135.33 0 229.33-93.91 94-93.92 94-229.42 0-135.33-94-229.33t-229.66-94q-135 0-229 94t-94 229.66q0 135 93.91 229 93.92 94 229.42 94ZM480-480Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        });

        this.dataMap.set('Save', {
            pathData: {
                d: ['M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        });

        this.dataMap.set('Delete', {
            pathData: {
                d: ['M283-130q-30.94 0-52.97-22.03Q208-174.06 208-205v-512h-39v-75h193v-38h237v38h193v75h-39v512q0 30.94-22.03 52.97Q708.94-130 678-130H283Zm395-587H283v512h395v-512ZM365-283.5h75v-355h-75v355Zm156 0h75v-355h-75v355ZM283-717v512-512Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        });

        this.dataMap.set('Pencil', {
            pathData: {
                d: ['M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        });

        this.dataMap.set('Gear', {
            pathData: {
                d: ['m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        });

        this.dataMap.set('Dotted_Square', {
            pathData: {
                d: ['M186.67-186.67V-120q-27.5 0-47.09-19.58Q120-159.17 120-186.67h66.67ZM120-283.33V-350h66.67v66.67H120Zm0-163.34v-66.66h66.67v66.66H120ZM120-610v-66.67h66.67V-610H120Zm66.67-163.33H120q0-27.5 19.58-47.09Q159.17-840 186.67-840v66.67ZM283.33-120v-66.67H350V-120h-66.67Zm0-653.33V-840H350v66.67h-66.67ZM446.67-120v-66.67h66.66V-120h-66.66Zm0-653.33V-840h66.66v66.67h-66.66ZM610-120v-66.67h66.67V-120H610Zm0-653.33V-840h66.67v66.67H610Zm163.33 586.66H840q0 27.5-19.58 47.09Q800.83-120 773.33-120v-66.67Zm0-96.66V-350H840v66.67h-66.67Zm0-163.34v-66.66H840v66.66h-66.67Zm0-163.33v-66.67H840V-610h-66.67Zm0-163.33V-840q27.5 0 47.09 19.58Q840-800.83 840-773.33h-66.67Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        });

        this.dataMap.set('Row_Column',{
            pathData: {
                d: ['M360-240h440v-107H360v107ZM160-613h120v-107H160v107Zm0 187h120v-107H160v107Zm0 186h120v-107H160v107Zm200-186h440v-107H360v107Zm0-187h440v-107H360v107ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })

        this.dataMap.set('Shelf', {
            pathData: {
                d: ['M120-40v-880h80v80h560v-80h80v880h-80v-80H200v80h-80Zm80-480h80v-160h240v160h240v-240H200v240Zm0 320h240v-160h240v160h80v-240H200v240Zm160-320h80v-80h-80v80Zm160 320h80v-80h-80v80ZM360-520h80-80Zm160 320h80-80Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        });

        this.dataMap.set('Block_TR_Tilt', {
            pathData: {
                d: ['M674.67-457.33 457.33-674.67 674.67-892 892-674.67 674.67-457.33ZM120-532v-307.33h307.33V-532H120Zm412 412v-307.33h307.33V-120H532Zm-412 0v-307.33h307.33V-120H120Zm66.67-478.67h174v-174h-174v174Zm490.33 50 123.67-123.66L677-796 553.33-672.33 677-548.67Zm-78.33 362h174v-174h-174v174Zm-412 0h174v-174h-174v174Zm174-412Zm192.66-73.66ZM360.67-360.67Zm238 0Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })
        this.dataMap.set('Bookmark_Plus', {
            pathData: {
                d: ['M200-120v-640q0-33 23.5-56.5T280-840h240v80H280v518l200-86 200 86v-278h80v400L480-240 200-120Zm80-640h240-240Zm400 160v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })
            
        this.dataMap.set('Colour_Palette', {
            pathData: {
                d: ['M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })

        this.dataMap.set('Left_Select', {
            pathData: {
                d: ['M468-240q-96-5-162-74t-66-166q0-100 70-170t170-70q97 0 166 66t74 162l-84-25q-13-54-56-88.5T480-640q-66 0-113 47t-47 113q0 57 34.5 100t88.5 56l25 84ZM821-60 650-231 600-80 480-480l400 120-151 50 171 171-79 79Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })

        this.dataMap.set('Remove_Select', {
            pathData: {
                d: ['m500-120-56-56 142-142-142-142 56-56 142 142 142-142 56 56-142 142 142 142-56 56-142-142-142 142Zm-220 0v-80h80v80h-80Zm-80-640h-80q0-33 23.5-56.5T200-840v80Zm80 0v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80q33 0 56.5 23.5T840-760h-80ZM200-200v80q-33 0-56.5-23.5T120-200h80Zm-80-80v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm640 0v-80h80v80h-80Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })

        this.dataMap.set('Arrow-Left', {
            pathData: {
                d: ['m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })

        this.dataMap.set('Text-UL', {
            pathData: {
                d: ['M240-80 80-240l160-160 57 56-64 64h494l-63-64 56-56 160 160L720-80l-57-56 64-64H233l63 64-56 56Zm36-360 164-440h80l164 440h-76l-38-112H392l-40 112h-76Zm138-176h132l-64-182h-4l-64 182Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })

        this.dataMap.set('Edit-Note', {
            pathData: {
                d: ['M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })

        this.dataMap.set('Aspect-Ratio', {
            pathData: {
                d: ['M560-280h200v-200h-80v120H560v80ZM200-480h80v-120h120v-80H200v200Zm-40 320q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })

        this.dataMap.set('Image', {
            pathData: {
                d: ['M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z'], 
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })

        this.dataMap.set('Grid', {
            pathData: {
                d: ['M120-520v-320h320v320H120Zm0 400v-320h320v320H120Zm400-400v-320h320v320H520Zm0 400v-320h320v320H520ZM200-600h160v-160H200v160Zm400 0h160v-160H600v160Zm0 400h160v-160H600v160Zm-400 0h160v-160H200v160Zm400-400Zm0 240Zm-240 0Zm0-240Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })
        
        this.dataMap.set('Folder', {
            pathData: {
                d: ['M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })
        
        this.dataMap.set('Restart-alt', {
            pathData: {
                d: ['M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })
        
        this.dataMap.set('Download', {
            pathData: {
                d: ['M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })
        
        this.dataMap.set('Upload', {
            pathData: {
                d: ['M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })
        
        this.dataMap.set('View-Sidebar', {
            pathData: {
                d: ['M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm540-453h100v-107H700v107Zm0 186h100v-106H700v106ZM160-240h460v-480H160v480Zm540 0h100v-107H700v107Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })
        
        this.dataMap.set('Window', {
            pathData: {
                d: ['M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H160v400Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })
        
        this.dataMap.set('Tick', {
            pathData: {
                d: ['M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })
        
        this.dataMap.set('Stack', {
            pathData: {
                d: ['M240-400v80h-80q-33 0-56.5-23.5T80-400v-400q0-33 23.5-56.5T160-880h400q33 0 56.5 23.5T640-800v80h-80v-80H160v400h80ZM400-80q-33 0-56.5-23.5T320-160v-400q0-33 23.5-56.5T400-640h400q33 0 56.5 23.5T880-560v400q0 33-23.5 56.5T800-80H400Zm0-80h400v-400H400v400Zm200-200Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })

        this.dataMap.set('Paint_Bucket', {
            pathData: {
                d: ['M346-140 100-386q-10-10-15-22t-5-25q0-13 5-25t15-22l230-229-106-106 62-65 400 400q10 10 14.5 22t4.5 25q0 13-4.5 25T686-386L440-140q-10 10-22 15t-25 5q-13 0-25-5t-22-15Zm47-506L179-432h428L393-646Zm399 526q-36 0-61-25.5T706-208q0-27 13.5-51t30.5-47l42-54 44 54q16 23 30 47t14 51q0 37-26 62.5T792-120Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })

        this.dataMap.set('Add', {
            pathData: {
                d: ['M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })

        this.dataMap.set('Contrast', {
            pathData: {
                d: ['M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm40-83q119-15 199.5-104.5T800-480q0-123-80.5-212.5T520-797v634Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })

        this.dataMap.set('Abc', {
            pathData: {
                d: ['M680-360q-17 0-28.5-11.5T640-400v-160q0-17 11.5-28.5T680-600h120q17 0 28.5 11.5T840-560v40h-60v-20h-80v120h80v-20h60v40q0 17-11.5 28.5T800-360H680Zm-300 0v-240h160q17 0 28.5 11.5T580-560v40q0 17-11.5 28.5T540-480q17 0 28.5 11.5T580-440v40q0 17-11.5 28.5T540-360H380Zm60-150h80v-30h-80v30Zm0 90h80v-30h-80v30Zm-320 60v-200q0-17 11.5-28.5T160-600h120q17 0 28.5 11.5T320-560v200h-60v-60h-80v60h-60Zm60-120h80v-60h-80v60Z'],
                transforms: null,
            },
            viewBox: '0 -960 960 960',
        })

    }

// Boolean
// --------------------------------------------------------------------------------------------------------------------------

    isValidIndex(index){
        return (index <= (this.dataMap.size-1) && index >= 0);
    }

// Get path data
// --------------------------------------------------------------------------------------------------------------------------
    
    // Have to just iterate through the keys of the map to find the correct name
    getIndexFromName(name){
        let index = -1;
        const iter = this.dataMap.keys();
        
        for(let i = 0; i < this.dataMap.size; i++){
            index++;
            if(iter.next().value === name) break;
        }
        return index;
    }

    getNameFromIndex(index){
        const iter = this.dataMap.keys();
        var name;

        for(let i = 0; i < this.dataMap.size; i++){
            name = iter.next().value;
            if(i === index) break;
        }
        return name;
    }

    // Have to value check outside function
    getIconObject(name){ return this.dataMap.get(name); }

    getViewBox(name){
        let data = this.getIconObject(name);
        if(!data) return data; // no data
        return data.viewBox;
    }

    getPathData(name){
        let data = this.getIconObject(name);
        if(!data) return data; // no data

        // console.log(name , ",", data.pathData)

        return data.pathData;
    }

// Imports + exports
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

    resetImports(){ this.importedSVG = new Map(); }

    setImportedSVGs(data){ 

        if(!data) return;
        
        this.importedSVG = new Map(data);

        // add contents of new map to the existing.
        this.dataMap = new Map([...this.dataMap, ...this.importedSVG]);
    }
    get importedSVGs(){ return this.importedSVG; }

// Modifiers
// ---------------------------------------------------------------------------------------------------------------------------

    changeName(oldName, newName){
        for(let i=0; i<this.data.length; i++){ if(this.data[i].name === oldName){ this.data[i].name = newName; return; } };
        console.error(`Error iconImages.js: ${inputName} does not exist within the array`);
    }

    // Generates hashed name based on the path data
    genPathHash(pathData){
        String.prototype.hashCode = function() {
            var hash = 0,
              i, chr;
            if (this.length === 0) return hash;
            for (i = 0; i < this.length; i++) {
              chr = this.charCodeAt(i);
              hash = ((hash << 5) - hash) + chr;
              hash |= 0; // Convert to 32bit integer
            }
            return hash;
        }

        return pathData.hashCode();
    }

    newSVGObject(destination, svgName, data, viewBox){
        
        console.log("add:", data)

        // Need to make sure data is correct.        
        destination.set(svgName, {
            pathData: data,
            viewBox: viewBox,
        })
    }

    /*
        SVG parser
        Input is a SVG icon
        Scrapes the 'd' path data to store it.
    */
    svgParser(result){

        // Parses the string to a DOM element
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "image/svg+xml");

        let svgEl = doc.lastElementChild;

        // last node is not svg
        // This was checked within file upload so it shouldnt early return
        if(svgEl.nodeName != "svg"){ console.log("last child, not svg"); return; }

        // Create ID from the first path data found. 
        this.isFirstItemPushed = true;
        this.firstPathData = null;
        
        // Recurrsion algorithm to extract all 'g' and 'path' tag data 
        let pathData = this.extractAllData(svgEl.children)[0]; // 0, it requires the object not the list

        
        var svgName = this.genPathHash(this.firstPathData); // Generated from the path data
        var viewBox = svgEl.attributes.viewBox.nodeValue;

        
        if(this.getIconObject(svgName)) return; // Check if name exist
        // Should inform the user if the icon is already imported...

        this.newSVGObject(this.dataMap, svgName, pathData, viewBox);
        this.newSVGObject(this.importedSVG, svgName, pathData, viewBox); // Put to another map, used for exporting.
    }

    // Recurrsive algorithm 
    // Navigate and extract all the data.
    extractAllData(childrenNodes){
        
        let htmlLayout = [];
        
        // Go through all children
        for(let i = 0; i < childrenNodes.length; i++){
            
            
            let tag = childrenNodes[i].tagName;
            if(!(tag === "g" || tag === "path")) continue;
            // Only look at 'g' and 'path' tags

            // Adds the transform string if there is any
            var transform = childrenNodes[i].attributes.transform;
            transform = (transform) ? transform.value : null;

            // Go further
            if(tag === "g"){
                // check for children
                if(childrenNodes[i].children.length === 0) continue;

                htmlLayout.push({
                    d: this.extractAllData(childrenNodes[i].children),
                    transforms: transform,
                })
            }

            else if(tag === "path"){

                let data = childrenNodes[i].attributes.getNamedItem('d');
                if(!data) continue;

                htmlLayout.push({
                    d: [data.nodeValue], // node value is an object, we need an array
                    transforms: transform,
                });

                // If found first node, save the path data for ID
                if(this.isFirstItemPushed){
                    this.isFirstItemPushed = false;
                    this.firstPathData = data.nodeValue;
                }
            }
        }

        return htmlLayout;
    }
}

const iconImageInstance = new IconImages;
 
export const iconImageStorage = reactive(iconImageInstance);