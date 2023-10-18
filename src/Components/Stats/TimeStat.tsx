import React, { useEffect, useState } from 'react';
import { HassEntity } from 'home-assistant-js-websocket';
import { ThreedyCondition, ThreedyConfig, ThreedyPrinter } from '../../types';
import Stat from './Stat';
import moment from 'moment';

const formatDuration = (
    time: number,
    round: boolean
) => {
    return (
        round ? moment.duration(time, "seconds").humanize() : (() => {

            const t = moment.duration(time, 'seconds');

            const d = t.days();
            const h = t.hours();
            const m = t.minutes();
            const s = t.seconds();


            return `${d > 0 ? `${d}d` : ''}${h > 0 ? ` ${h}h` : ''}${m > 0 ? ` ${m}m` : ''}${s > 0 ? ` ${s}s` : ''}`

        })()
    )
}

const renderTime = (
    time: number,
    condition: ThreedyCondition,
    config: ThreedyConfig
) => {

    const r = config.round_time;

    switch (condition) {
        case ThreedyCondition.Remaining:
            return formatDuration(time, r)
        case ThreedyCondition.ETA:
            return moment().add(time, 'seconds').format(config.use_24hr ? "HH:mm" : "h:mm a")
        case ThreedyCondition.Elapsed:
            return formatDuration(time, r)
        default:
            return '<unknown>'
    }
}

const getTotalSeconds = (
    timeEntity: HassEntity,
    config: ThreedyConfig
) => {
    if(config.printer_type === ThreedyPrinter.BambuLab) {
        return parseInt(timeEntity.state) * 60 || 0;
    }

    if(!config.use_mqtt){
        return parseInt(timeEntity.state) || 0;
    }

    if(timeEntity.state) {
        const [hours, minutes, seconds] = timeEntity.state.split(':');
        return (+hours) * 60 * 60 + (+minutes) * 60 + (+seconds);
    }
    return 0;
}


type TimeStatProps = {
    timeEntity: HassEntity,
    condition: ThreedyCondition
    config: ThreedyConfig,
    direction: number
}

const TimeStat: React.FC<TimeStatProps> = ({timeEntity, condition, config, direction}) => {
    const totalSeconds = getTotalSeconds(timeEntity, config);
    const [ time, setTime ] = useState<number>(totalSeconds);
    const [ lastIntervalId, setLastIntervalId ] = useState<number>(-1);

    const incTime = () => setTime( time => (parseInt(time) + parseInt(direction)) );

    useEffect(() => {

        if (lastIntervalId !== -1) clearInterval(lastIntervalId);

        setTime(getTotalSeconds(timeEntity, config));

        const id = setInterval(
            incTime,
            1000
        );

        setLastIntervalId(id);

        return () => {
            clearInterval(lastIntervalId);
            clearInterval(id);
        }
    }, [timeEntity])

    return (
        <Stat
            name={condition}
            value={
                renderTime(
                    time,
                    condition,
                    config
                )
            }
        />
    )


}

export default TimeStat;
