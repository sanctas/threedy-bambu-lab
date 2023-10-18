import React, { useContext, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { IoPower } from 'react-icons/io5'
import { FaRegLightbulb, FaLightbulb } from 'react-icons/fa';

import ThreedyContext from '../../Contexts/ThreedyContext';
import toggleEntity from '../../Utils/Toggle';

import PrinterView from '../PrinterView';
import Stats from '../Stats';

import styles from './styles';
import Camera from "../Camera";
import {percentComplete} from "../Stats/utils";
import { ThreedyPrinter } from '../../types';


const Card = ({ }) => {

    const {
        config,
        hass
    } = useContext(ThreedyContext);

    const [
        hiddenOverride,
        setHiddenOverride
    ] = useState(false);

    const [
        showVideo,
        setShowVideo
    ] = useState(false);

    const toggleVideo = config.camera_entity ? () => {
        setShowVideo(!showVideo)
    } : () => {}


    const cameraEntity = config.camera_entity ? hass.states[config.camera_entity] || undefined : undefined;


    const theme = config.theme || 'Default';
    const vertical = config.vertical;
    const round = config.round;
    const percent = percentComplete(hass, config);


    const borderRadius = styles[theme] ? styles[theme].borderRadius : styles['Default'].borderRadius;

    const state = config?.printer_type === ThreedyPrinter.BambuLab
      ? (hass.states[`${config.base_entity}_current_stage`] || { state: "unknown" }).state
      : (hass.states[config.use_mqtt ? `${config.base_entity}_print_status` : `${config.base_entity}_current_state`] || {state: 'unknown'}).state
    const light_on = config.light_entity ? (hass.states[config.light_entity] || {state: 'off'}).state === 'on' : false;

    const neumorphicShadow = hass.themes.darkMode ? '-5px -5px 8px rgba(50, 50, 50,.2),5px 5px 8px rgba(0,0,0,.08)' : '-4px -4px 8px rgba(255,255,255,.5),5px 5px 8px rgba(0,0,0,.03)'
    const defaultShadow = 'var( --ha-card-box-shadow, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) )'

    const hidden = state.toLowerCase() !== 'printing' && !hiddenOverride;
    const statusColor = useMemo(() => {
        switch (state.toLowerCase()) {
            case 'printing':
                return '#4caf50';
            case 'auto bed leveling':
            case 'heatbed preheating':
            case 'changing filament':
            case 'heating hotend':
            case 'homing toolhead':
            case 'cleaning nozzle tip':
                return '#782686';
            case 'm400 pause':
            case 'paused due to filament runout':
                return '#01ce8d';
            case 'unknown':
            case 'offline':
                return '#f44336';
            case 'operational':
            case 'idle':
                return "#00bcd4";
            default:
                return "#ffc107";
        }
    }, [status]);

    return (
        <motion.div
            animate={{ borderRadius: hidden ? borderRadius : borderRadius * 2 }}
            transition={{ ease: "easeInOut", duration: 0.25 }}
            style={{
                ...styles.Card,
                ...styles[theme],
                fontFamily: config.font || 'sans-serif',
                boxShadow: theme === 'Neumorphic' ? neumorphicShadow : defaultShadow
            }}
        >
            <div style={{ ...styles.Root }}>

                <div
                    style={{
                        ...styles.Header,
                        justifyContent: config.power_entity || config.light_entity ? 'space-between' : 'center'
                    }}
                >

                    {
                        config.light_entity && !config.power_entity ? (
                            <div style={{ ...styles.PowerButton }} />
                        ) : null
                    }

                    {
                        config.power_entity ? (
                            <button
                                style={{ ...styles.PowerButton }}
                                onClick={() => toggleEntity(hass, config.power_entity)}
                            >
                                <IoPower />
                            </button>
                        ) : null
                    }

                    <button
                        style={{ ...styles.NameStatus }}
                        onClick={() => setHiddenOverride(!hiddenOverride)}
                    >
                        <div
                            style={{
                                ...styles.StatusDot,
                                backgroundColor: statusColor
                            }}
                        />
                        <p style={{ ...styles.HeaderText }}>{ config.name || '(no name)' }</p>
                    </button>

                    {
                        config.light_entity ? (
                            <button
                                style={{ ...styles.PowerButton }}
                                onClick={() => toggleEntity(hass, config.light_entity)}
                            >
                                {
                                    light_on ? <FaLightbulb /> : <FaRegLightbulb />
                                }
                            </button>
                        ) : null
                    }

                    {
                        config.power_entity && !config.light_entity ? (
                            <div style={{ ...styles.PowerButton }} />
                        ) : null
                    }

                </div>

                <motion.div
                    style={{ ...styles.Content, flexDirection: vertical ? 'column' : 'row' }}
                    animate={{ height: hidden ? 0.0 : 'auto', opacity: hidden ? 0.0 : 1.0, scale: hidden ? 0.0 : 1.0 }}
                    transition={{ ease: "easeInOut", duration: 0.25 }}
                >
                    <div style={{ ...styles.Section, width: vertical ? '100%' : '50%', height: vertical ? 'auto' : '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: vertical ? 64 : 16, paddingRight: vertical ? 64 : 16 }}>
                        <PrinterView
                            toggleVideo={toggleVideo}
                            hasCamera={config.camera_entity !== undefined}
                            style={{width: vertical ? 'auto' : '100%', flexGrow: 1}}
                        />
                        {
                            vertical ? (
                                <p style={{ width: '50%', fontSize: 36, textAlign: 'center', fontWeight: 'bold' }}>
                                    {round ? Math.round(percent as number) : percent}%
                                </p>
                            ) : null
                        }
                    </div>
                    <div
                        style={{
                            ...styles.Section,
                            paddingLeft: vertical ? 32 : 16,
                            paddingRight: vertical ? 32 : 32,
                            width: vertical ? '100%' : '50%',
                            height: vertical ? 'auto' : '100%'
                        }}
                    >
                        <Stats showPercent={!vertical} />
                    </div>
                </motion.div>

            </div>

            {
                cameraEntity ? (
                    <Camera
                        visible={showVideo}
                        toggleVideo={() => setShowVideo(false)}
                        cameraEntity={cameraEntity}
                    />
                ) : null
            }

        </motion.div>
    )

}

export default Card;
