const Defaults = {
    'I3': {

        top: {
            width: 350,
            height: 20,
        },
        bottom: {
            width: 350,
            height: 52.3,
        },
        left: {
            width: 40,
            height: 405,
        },
        right: {
            width: 40,
            height: 405,
        },

        buildplate: {
            maxWidth: 235,
            maxHeight: 250,
            verticalOffset: 55,
        },

        xAxis: {
            stepper: true,
            width: 420,
            offsetLeft: -40,
            height: 20,
            extruder: {
                width: 60,
                height: 60
            }
        }

    },
    'Cantilever': {
        ZAxis: {
            height: 240,
            width: 80,
            offsetLeft: 0
        },
        Bottom: {
            width: 220,
            height: 80
        },
        BuildPlate: {
            maxWidth: 120,
            maxHeight: 120,
            verticalOffset: 20,
            horizontalOffset: 20
        },
        XAxis: {
            width: 260,
            offsetLeft: 0,
            height: 60,
            extruder: {
                width: 40,
                height: 60,
                offsetY: 20
            }
        }
    },
    'BambuLab': {
        top: {
            width: 350,
            height: 20,
        },
        bottom: {
            width: 350,
            height: 52.3,
        },
        left: {
            width: 40,
            height: 405,
        },
        right: {
            width: 40,
            height: 405,
        },

        buildplate: {
            maxWidth: 235,
            maxHeight: 250,
            verticalOffset: 55,
        },

        xAxis: {
            stepper: true,
            width: 420,
            offsetLeft: -40,
            height: 20,
            extruder: {
                width: 60,
                height: 60
            }
        }
    }
};

export default Defaults;
