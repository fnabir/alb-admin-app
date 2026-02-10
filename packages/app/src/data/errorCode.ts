type ErrorInfo = {
  description: string;
  level: {
    code: string;
    description: string;
  };
  cause: any[];
  solution: any[];
};

export const ERROR_CODE: Record<string, ErrorInfo> = {
  '1': {
    description: 'Invert unit protection',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Main loop output is grounding or short wiring.',
      'The connection of traction machine is too long.',
      'Work condition is too hot.',
      'The connections inside the controller become loose.',
    ],
    solution: [
      'Obviate exterior problems such as connection.',
      'Add reactor or output filter.',
      'Inspect the wind channel and fan.',
      'Please contact with agent or factory',
    ],
  },
  '2': {
    description: 'Overcurrent during acceleration',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'The main circuit output is grounded or short circuited.',
      'Motor auto-tuning is performed improperly.',
      'The encoder signal is incorrect.',
    ],
    solution: [
      [
        'Check the contactors',
        [
          'Check whether the RUN contactor at the controller output side is normal.',
          'Check whether the shorting PMSM stator contactor causes short circuit at the controller output side.',
        ],
      ],
      [
        'Check motor cables',
        [
          'Check whether the motor cables have damaged jacket, possibly short circuited to ground, and connected securely.',
          'Check insulation of motor power terminals, and check whether the motor winding is short circuited or grounded.',
        ],
      ],
      [
        'Check motor parameters',
        ['Check whether motor parameters comply with the nameplate.'],
      ],
      [
        'Check the encoder',
        [
          'Check whether encoder pulses per revolution (PPR) is set correctly.',
          'Check whether the  encoder  signal is interfered with, whether the encoder cable runs through the duct independently, whether the cable is too long, and whether the shield is grounded at one end.',
          'Check whether the encoder is installed reliably, whether the rotating shaft is connected to the motor shaft reliably by observing whether the encoder is stable during normal-speed running.',
          'Check whether the encoder wirings are correct. For asynchronous motor, perform SVC and compare the current to judge whether the encoder works properly.',
        ],
      ],
    ],
  },
  '3': {
    description: 'Overcurrent during deceleration',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'The main circuit output is grounded or short circuited.',
      'Motor auto-tuning is performed improperly.',
      'The deceleration rate is too short.',
      'The encoder signal is incorrect.',
    ],
    solution: [
      [
        'Check the contactors',
        [
          'Check whether the RUN contactor at the controller output side is normal.',
          'Check whether the shorting PMSM stator contactor causes short circuit at the controller output side.',
        ],
      ],
      [
        'Check motor cables',
        [
          'Check whether the motor cables have damaged jacket, possibly short circuited to ground, and connected securely.',
          'Check insulation of motor power terminals, and check whether the motor winding is short circuited or grounded.',
        ],
      ],
      [
        'Check motor parameters',
        ['Check whether motor parameters comply with the nameplate.'],
      ],
      [
        'Check the encoder',
        [
          'Check whether encoder pulses per revolution (PPR) is set correctly.',
          'Check whether the  encoder  signal is interfered with, whether the encoder cable runs through the duct independently, whether the cable is too long, and whether the shield is grounded at one end.',
          'Check whether the encoder is installed reliably, whether the rotating shaft is connected to the motor shaft reliably by observing whether the encoder is stable during normal-speed running.',
          'Check whether the encoder wirings are correct. For asynchronous motor, perform SVC and compare the current to judge whether the encoder works properly.',
        ],
      ],
    ],
  },
  '4': {
    description: 'Overcurrent at constant speed',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'The main circuit output is grounded or short circuited.',
      'Motor auto-tuning is performed properly.',
      'The encoder is seriously interfered with.',
    ],
    solution: [
      [
        'Check the contactors',
        [
          'Check whether the RUN contactor at the controller output side is normal.',
          'Check whether the shorting PMSM stator contactor causes short circuit at the controller output side.',
        ],
      ],
      [
        'Check motor cables',
        [
          'Check whether the motor cables have damaged jacket, possibly short circuited to ground, and connected securely.',
          'Check insulation of motor power terminals, and check whether the motor winding is short circuited or grounded.',
        ],
      ],
      [
        'Check motor parameters',
        ['Check whether motor parameters comply with the nameplate.'],
      ],
      [
        'Check the encoder',
        [
          'Check whether encoder pulses per revolution (PPR) is set correctly.',
          'Check whether the  encoder  signal is interfered with, whether the encoder cable runs through the duct independently, whether the cable is too long, and whether the shield is grounded at one end.',
          'Check whether the encoder is installed reliably, whether the rotating shaft is connected to the motor shaft reliably by observing whether the encoder is stable during normal-speed running.',
          'Check whether the encoder wirings are correct. For asynchronous motor, perform SVC and compare the current to judge whether the encoder works properly.',
        ],
      ],
    ],
  },
  '5': {
    description: 'Overvoltage during acceleration',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'The input voltage is too high.',
      'The regeneration power of the motor is too high.',
      'The braking resistance is too large, or the braking unit fails.',
      'The acceleration rate is too short.',
    ],
    solution: [
      'Check whether the input voltage is too high. Observe whether the bus voltage is too high (normal: 540\u2013580 V for 380 voltage input).',
      'Check for the balance coefficient.',
      [
        'Check whether the bus voltage rises too quickly during running. If yes, the regen. resistor does not work or its model is improper:',
        [
          'Check whether the cable connecting the regen. resistor is damaged, whether the cooper wire touches the ground, and whether the connection is reliable.',
          'Check whether the resistance is proper based on the recommendation in chapter 4 and select a proper regen. resistor.',
          'If a braking unit is used, check whether the braking unit works properly and whether the model is proper.',
        ],
      ],
      'If the resistance of the regen. resistor is proper and overvoltage occurs each time when the elevator reaches the target speed, decrease the values of F2\u201301 or F2\u201304 to reduce the curve following error and prevent overvoltage due to system overshoot.',
      'Check whether the acceleration/deceleration rate is too short when E05 and E06 is reported.',
    ],
  },
  '6': {
    description: 'Overvoltage during deceleration',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'The input voltage is too high.',
      'The braking resistance is too large, or the braking unit fails.',
      'The deceleration rate is too short.',
    ],
    solution: [
      'Check whether the input voltage is too high. Observe whether the bus voltage is too high (normal: 540\u2013580 V for 380 voltage input).',
      'Check for the balance coefficient.',
      [
        'Check whether the bus voltage rises too quickly during running. If yes, the regen. resistor does not work or its model is improper:',
        [
          'Check whether the cable connecting the regen. resistor is damaged, whether the cooper wire touches the ground, and whether the connection is reliable.',
          'Check whether the resistance is proper based on the recommendation in chapter 4 and select a proper regen. resistor.',
          'If a braking unit is used, check whether the braking unit works properly and whether the model is proper.',
        ],
      ],
      'If the resistance of the regen. resistor is proper and overvoltage occurs each time when the elevator reaches the target speed, decrease the values of F2\u201301 or F2\u201304 to reduce the curve following error and prevent overvoltage due to system overshoot.',
      'Check whether the acceleration/deceleration rate is too short when E05 and E06 is reported.',
    ],
  },
  '7': {
    description: 'Overvoltage at constant speed',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'The input voltage is too high.',
      'The braking resistance is too large, or the braking unit fails.',
    ],
    solution: [
      'Check whether the input voltage is too high. Observe whether the bus voltage is too high (normal: 540\u2013580 V for 380 voltage input).',
      'Check for the balance coefficient.',
      [
        'Check whether the bus voltage rises too quickly during running. If yes, the regen. resistor does not work or its model is improper:',
        [
          'Check whether the cable connecting the regen. resistor is damaged, whether the cooper wire touches the ground, and whether the connection is reliable.',
          'Check whether the resistance is proper based on the recommendation in chapter 4 and select a proper regen. resistor.',
          'If a braking unit is used, check whether the braking unit works properly and whether the model is proper.',
        ],
      ],
      'If the resistance of the regen. resistor is proper and overvoltage occurs each time when the elevator reaches the target speed, decrease the values of F2\u201301 or F2\u201304 to reduce the curve following error and prevent overvoltage due to system overshoot.',
      'Check whether the acceleration/deceleration rate is too short when E05 and E06 is reported.',
    ],
  },
  '8': {
    description: 'Maintenance notification period reached',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: ['The elevator is not maintained within the notification period.'],
    solution: [
      'Power-off and maintain the elevator.',
      'Disable the maintenance notification function by setting F9\u201313 to 0.',
      'Contact us or directly our agent.',
    ],
  },
  '9': {
    description: 'Undervoltage',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Instantaneous power failure occurs on the input power supply.',
      'The input voltage is too low.',
      'The drive control board fails.',
    ],
    solution: [
      'Check whether the external power voltage is too low.',
      'Check whether the power fails during running.',
      'Check whether wiring of all power input cables is secure.',
      'Contact us or directly our agent.',
    ],
  },
  '10': {
    description: 'Controller overload',
    level: {
      code: '4A',
      description:
        'In low-speed running, the elevator stops under special deceleration rate, and cannot restart.',
    },
    cause: [
      'This fault is reported generally when the controller runs at the current higher than the rated value for a long time. The causes include:',
      [
        'The mechanical resistance is too large.',
        'The balance coefficient is improper.',
        'The encoder feedback signal is abnormal.',
        'Motor auto-tuning is not performed properly (the elevator running current is higher than the normal in this case).',
      ],
    ],
    solution: [
      [
        'Eliminate mechanical problems:',
        [
          'Check whether the brake is released, and whether the brake power supply is normal.',
          'Check whether the balance coefficient is proper.',
          'Check whether the guide shoes are too tight.',
        ],
      ],
      [
        'Check the motor auto-tuning result:',
        [
          'Check whether the encoder feedback signal and parameter setting are correct, and whether the initial angle of the encoder for the PMSM is correct.',
          'Check the motor parameter setting and perform motor auto-tuning again.',
        ],
      ],
      'If this fault is reported when the slip experiment is carried on, perform the slip experiment by using the function set in F3\u201324.',
    ],
  },
  '11': {
    description: 'Motor overload',
    level: {
      code: '3A',
      description:
        'In low-speed running, the elevator stops at special deceleration rate, and cannot restart.',
    },
    cause: [
      'FC-02 is set improperly.',
      'The mechanical resistance is too large.',
      'The balance coefficient is improper.',
    ],
    solution: [
      'Restore FC-02 to the default value.',
      'Refer to the solution of E10.',
    ],
  },
  '12': {
    description: 'Power supply phase loss',
    level: {
      code: '4A',
      description:
        'In low-speed running, the elevator stops under special deceleration rate, and cannot restart.',
    },
    cause: [
      'The power input phases are not symmetric.',
      'The drive control board fails.',
    ],
    solution: [
      'Check whether the three phases of power supply are balanced and whether the power voltage is normal. If not, adjust the power supply.',
      'Contact supplier.',
    ],
  },
  '13': {
    description: 'Power output phase loss',
    level: {
      code: '4A',
      description:
        'In low-speed running, the elevator stops under special deceleration rate, and cannot restart.',
    },
    cause: [
      'The output wiring of the main circuit is loose.',
      'The motor is damaged.',
    ],
    solution: [
      'Check whether the motor wiring is secure.',
      'Check whether the RUN contactor on the output side is normal.',
      'Eliminate the motor fault.',
    ],
  },
  '14': {
    description: 'Module overheat',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'The ambient temperature is too high.',
      'The fan is damaged.',
      'The air filter is clogged.',
    ],
    solution: [
      'Lower the ambient temperature.',
      'Clear the air filter.',
      'Replace the damaged fan.',
      'Check whether the installation clearance of the controller satisfies the requirement.',
    ],
  },
  '15': {
    description: 'Output abnormal',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Braking (resistor) short occurs on the output side.',
      'The RUN contactor is abnormal.',
    ],
    solution: [
      'Check wiring of the regen. resistor and braking unit is correct, without short circuit.',
      'Check whether the main contactor works properly and whether there is arch or stuck problem.',
      'Contact us or directly our agent.',
    ],
  },
  '16': {
    description: 'Current control fault',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Subcodes 1, 2: The current deviation is too large.',
      'Subcode 3: The speed deviation is too large.',
    ],
    solution: [
      [
        'Subcodes 1, 2:',
        [
          'Check whether the input voltage is low (often in temporary power supply).',
          'Check whether cable connection between the controller and the motor is secure.',
          'Check whether the RUN contactor works properly.',
        ],
      ],
      [
        'Subcode 3:',
        [
          [
            'Check the circuit of the encoder: ',
            [
              'Check whether encoder pulses per revolution (PPR) is set correctly.',
              'Check whether the encoder signal is interfered with, whether the encoder cable runs through the duct independently, whether the cable is too long, and whether the shield is grounded at one end.',
              'Check whether the encoder is installed reliably, whether the rotating shaft is connected to the motor shaft reliably by observing whether the encoder is stable during normal-speed running.',
            ],
          ],
        ],
        'Check whether the motor parameters are correct, and perform motor auto-tuning again.',
        'Increase the torque upper limit in F2\u201308.',
      ],
    ],
  },
  '17': {
    description: 'Encoder interference during motor auto-tuning',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Subcode 1: Reserved.',
      'Subcode 2: The SIN/ COS encoder signal is abnormal.',
      'Subcode 3: The UVW encoder signal is abnormal.',
    ],
    solution: [
      [
        'Subcode 2:',
        [
          'Serious interference exists in the C, D, and Z signals of the SIN/COS encoder. Check whether the encoder c cable is laid separately from the power cables, and whether system grounding is reliable.',
          'Check whether the PG card is wired correctly.',
        ],
      ],
      [
        'Subcode 3:',
        [
          'Serious interference exists in the U, V, and W signals of the UVW encoder. Check whether the encoder c cable is laid separately from the power cables, and whether system grounding is reliable.',
          'Check whether the PG card is wired correctly.',
        ],
      ],
    ],
  },
  '18': {
    description: 'Current detection fault',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: ['The drive control board fails.'],
    solution: ['Contact Supplier.'],
  },
  '19': {
    description: 'Motor auto-tuning fault',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Subcode 1: Learning the stator resistance fails.',
      'Subcodes 5, 6: Learning the magnetic pole position fails.',
      'Subcode 8: Reserved.',
      'Subcode 11: Saving the angle fails at synchronous motor angle-free auto- tuning.',
      'Subcodes 101, 102: Motor auto-tuning fails.',
    ],
    solution: [
      [
        'Subcodes 1, 5, 6:',
        [
          'Check the motor wiring and whether phase loss occurs on the contactor at the output side.',
        ],
      ],
      [
        'Subcode 11:',
        [
          'At angle-free motor auto-tuning, the power is cut off when the motor rotary displacement is too small, and this fault is reported at direct running upon power-on again. To rectify the fault, perform angle-free motor auto- tuning again and make the motor runs for consecutive three revolutions.',
        ],
      ],
      [
        'Subcode 101:',
        [
          'Synchronous motor with-load auto-tuning times out.',
          'Check encoder wiring is correct, or replace the PG card and perform motor auto-tuning again.',
        ],
      ],
      [
        'Subcode 102:',
        [
          'Motor auto-tuning times out in operation panel control mode.',
          'Check encoder wiring is correct, or replace the PG card and perform motor auto-tuning again.',
        ],
      ],
    ],
  },
  '20': {
    description: 'Speed feedback incorrect',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Subcode 1:The encoder signal is not detected during synchronous motor no-load auto-tuning.',
      'Subcode 2: Reserved.',
      'Subcode 3: The phase sequence of the motor is incorrect.',
      'Subcode 4: Z signal cannot be detected during synchronous motor auto- tuning.',
      'Subcode 5: The cables of the SIN/COS encoder break.',
      'Subcode 7: The cables of the UVW encoder break.',
      'Subcode 8: Reserved',
      'Subcode 9: The speed deviation is too large.',
      'Subcode 10, 11: Reserved.',
      'Subcode 12: The encoder AB signals are lost at startup.',
      'Subcode 13: The encoder AB signals are lost during running.',
      'Subcodes 14\u201318: Reserved.',
      'Subcode 19: The signals of the SIN/COS encoder are seriously interfered with during running.',
      'Subcode 55: The signals of the SIN/COS encoder are seriously interfered with or CD signals are incorrect during motor auto-tuning.',
    ],
    solution: [
      [
        'Subcode 1, 4, 5, 7:',
        [
          'Check whether the encoder signal circuit is normal.',
          'Check whether the PG card is normal.',
        ],
      ],
      ['Subcode 3:', ['Exchange any two phases of the motor UVW cables.']],
      [
        'Subcode 9:',
        [
          'The angle of the synchronous motor is abnormal. Perform motor auto-tuning again.',
          'The speed loop proportional gain is small or integral time is large. Increase the proportional gain or decrease the integral time properly.',
        ],
      ],
      [
        'Subcode 12:',
        [
          'Check whether the brake has been released.',
          'Check whether AB signal cables of the encoder break.',
          'If the motor cannot be started at the slip experiment, perform the slip experiment by using the function set in F3\u201324.',
        ],
      ],
      [
        'Subcode 13:',
        [
          'AB signals of the encoder become loss suddenly. Check whether encoder wiring is correct, whether strong interference exists, or the motor is stuck due to sudden power failure of the brake during running.',
        ],
      ],
      [
        'Subcode 19:',
        [
          'The encoder analog signals are seriously interfered with during motor running, or encoder signals are in poor contact. You need to check the encoder circuit.',
        ],
      ],
      [
        'Subcode 55:',
        [
          'The encoder analog signals are seriously interfered with during motor auto-tuning, or encoder CD signals are in wrong sequence.',
        ],
      ],
    ],
  },
  '22': {
    description: 'Leveling signal abnormal',
    level: {
      code: '1A',
      description: 'The elevator running is not affected on any condition.',
    },
    cause: [
      'Subcode 101: The leveling signal is stuck.',
      'Subcode 102: The leveling signal is lost.',
      'Subcode 103: The leveling position deviation is too large in elevator auto- running state.',
    ],
    solution: [
      [
        'Subcodes 101, 102:',
        [
          'Check whether the leveling and door zone sensors work properly.',
          'Check the installation verticality and depth of the leveling plates.',
          'Check the leveling signal input points of the MCB.',
        ],
      ],
      ['Subcode 103:', ['Check whether the steel rope slips.']],
    ],
  },
  '23': {
    description: 'Motor short circuit to ground',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: ['Short circuit to ground exists on the motor side.'],
    solution: [
      'Check whether short circuit to ground exists on the motor side.',
    ],
  },
  '24': {
    description: 'RTC clock fault',
    level: {
      code: '3B',
      description:
        'In low-speed running, the elevator does not stop. In normal-speed running, the elevator stops, and then can start running at low speed after a delay of 3s.',
    },
    cause: ['Subcode 101: The RTC clock information of the MCB is abnormal.'],
    solution: [
      ['Subcode 101:', ['Replace the clock battery.', 'Replace the MCB.']],
    ],
  },
  '25': {
    description: 'Storage data abnormal',
    level: {
      code: '4A',
      description:
        'In low-speed running, the elevator stops under special deceleration rate, and cannot restart.',
    },
    cause: ['Subcodes 101, 102: The storage data of the MCB is abnormal.'],
    solution: ['Subcodes 101, 102: Contact supplier.'],
  },
  '26': {
    description: 'Earthquake signal',
    level: {
      code: '3B',
      description:
        'In low-speed running, the elevator does not stop. In normal-speed running, the elevator stops, and then can start running at low speed after a delay of 3s.',
    },
    cause: [
      'Subcode 101: The earthquake signal is active and the duration exceeds 2s.',
    ],
    solution: [
      [
        'Subcode 101:',
        [
          'Check that the earthquake signal is consistent with the parameter setting (NC, NO) of the MCB.',
        ],
      ],
    ],
  },
  '29': {
    description: 'Shorting PMSM stator contactor feedback abnormal',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Subcode 101: Feedback of the shorting PMSM stator contactor is abnormal.',
    ],
    solution: [
      [
        'Subcode 101:',
        [
          'Check that the signal feature (NO, NC) of the feedback contact on the contactor is correct.',
          'Check that the contactor and corresponding feedback contact act correctly.',
          'Check the coil circuit of the shorting PMSM stator contactor.',
        ],
      ],
    ],
  },
  '30': {
    description: 'Elevator position abnormal',
    level: {
      code: '4A',
      description:
        'In low-speed running, the elevator stops under special deceleration rate, and cannot restart.',
    },
    cause: [
      'Subcodes 101, 102: In the normal\u2013speed running or re\u2013leveling running mode, the running time is larger than the smaller of F9\u201302 and (FA- 38 + 10), but the leveling signal has no change.',
    ],
    solution: [
      [
        'Subcodes 101, 102:',
        [
          'Check whether the leveling signal cables are connected reliably and whether the signal copper wires may touch the ground or be short circuited with other signal cables.',
          'Check whether the distance between two floors is too large or the re-leveling time set in F3\u201321 is too short, causing over long re\u2013leveling running time.',
          'Check whether signal loss exists in the encoder circuits.',
        ],
      ],
    ],
  },
  '33': {
    description: 'Elevator speed abnormal',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Subcode 101: The detected running speed during normal-speed running exceeds the limit.',
      'Subcode 102: The speed exceeds the limit during inspection or shaft auto- tuning.',
      'Subcode 103: The speed exceeds the limit in shorting stator braking mode.',
      'Subcode 104: The speed exceeds the limit during emergency running.',
      'Subcode 105: The emergency running time protection function is enabled (set in Bit8 of F6\u201345), and the running time exceeds 50s, causing the timeout fault.',
    ],
    solution: [
      [
        'Subcode 101:',
        [
          'Check whether the parameter setting and wiring of the encoder are correct.',
          'Check the setting of motor nameplate parameters. Perform motor auto-tuning again.',
        ],
      ],
      [
        'Subcode 102:',
        [
          'Attempt to decrease the inspection speed or perform motor auto-tuning again.',
        ],
      ],
      [
        'Subcode 103:',
        ['Check whether the shorting PMSM stator function is enabled.'],
      ],
      [
        'Subcodes 104, 105:',
        [
          'Check whether the emergency power capacity meets the requirements.',
          'Check whether the emergency running speed is set properly.',
        ],
      ],
    ],
  },
  '34': {
    description: 'Logic fault',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: ['Logic of the MCB is abnormal.'],
    solution: ['Contact supplier to replace the MCB.'],
  },
  '35': {
    description: 'Shaft auto- tuning data abnormal',
    level: {
      code: '4C',
      description:
        'In low-speed running, the elevator does not stop. In normal-speed running, the elevator stops, and then can start running at low speed after a delay of 3s.',
    },
    cause: [
      'Subcode 101: When shaft auto-tuning is started, the elevator is not at the bottom floor or the down slow-down switch is invalid,',
      'Subcode 102: The system is not in the inspection state (inspection switch not turned on) when shaft auto-tuning is performed.',
      'Subcode 103: It is judged upon power-on that shaft auto-tuning is not performed.',
      'Subcodes 104, 113, 114: In distance control mode, it is judged at running startup that shaft auto- tuning is not performed.',
      'Subcode 105: The elevator running direction and the pulse change are inconsistent.',
      'Subcodes 106, 107, 109: The plate pulse length sensed at up/down leveling is abnormal.',
      'Subcodes 108, 110: No leveling signal is received within 45s continuous running.',
      'Subcodes 111, 115: The stored floor height is smaller than 50 cm.',
      'Subcode 112: The floor when auto-tuning is completed is not the top floor.',
    ],
    solution: [
      [
        'Handling at inspection-speed commissioning:',
        [
          'E35 (subcode 103) is reported at each power-on because shaft auto-tuning is not performed before inspection-speed commissioning. This fault does not affect inspection\u2013speed commissioning and you can hide the fault directly on the operation panel.',
        ],
      ],
      [
        'Handling at normal\u2013speed commissioning and running:',
        [
          [
            'Subcode 101:',
            [
              'Check that the down slow\u2013down switch is valid, and that F4\u201301 (Current floor) is set to the bottom floor number.',
            ],
          ],
          [
            'Subcode 102:',
            ['Check that the inspection switch is turned to inspection state.'],
          ],
          ['Subcodes 103, 104, 113, 114:', ['Perform shat auto-tuning again.']],
          [
            'Subcode 105:',
            [
              'Check whether the elevator running direction is consistent with the pulse change in F4\u201303: F4\u201303 increases in up direction and decreases in down direction. If not, change the value of F2\u201310 to ensure consistency.',
            ],
          ],
          [
            'Subcode 106, 107, 109:',
            [
              'Check that NO/NC state of the leveling sensor is set correctly.',
              'Check whether the leveling plates are inserted properly and whether there is strong power interference if the leveling sensor signal blinks.',
              'Check whether the leveling plate is too long for the asynchronous motor.',
            ],
          ],
          [
            'Subcodes 108, 110:',
            [
              'Check whether wiring of the leveling sensor is correct.',
              'Check whether the floor distance is too large, causing running time\u2013out. Increase the speed set in F3\u201311 and perform shaft auto\u2013tuning again to ensure that learning the floors can be completed within 45s.',
            ],
          ],
          [
            'Subcodes 111, 115:',
            [
              'Enable the super short floor function if the floor distance is less than 50 cm. If the floor distance is normal, check installation of the leveling plate for this floor and check the sensor.',
            ],
          ],
          [
            'Subcode 112:',
            [
              'Check whether the setting of F6\u201300 (Top floor of the elevator) is smaller than the actual condition.',
            ],
          ],
        ],
      ],
    ],
  },
  '36': {
    description: 'RUN contactor feedback abnormal',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Subcode 101: The feedback of the RUN contactor is active, but the contactor has no output.',
      'Subcode 102: The controller outputs the RUN signal but receives no RUN feedback.',
      'Subcode 103: The startup current of the asynchronous motor is too small.',
      'Subcode 104: When both feedback signals of the RUN contactor are enabled, their states are inconsistent.',
    ],
    solution: [
      [
        'Subcodes 101, 102, 104:',
        [
          'Check whether the feedback contact of the contactor acts properly.',
          'Check the signal feature (NO, NC) of the feedback contact.',
        ],
      ],
      [
        'Subcode 103:',
        [
          'Check whether the output cables UVW of the controller are connected properly.',
          'Check whether the control circuit of the RUN contactor coil is normal.',
        ],
      ],
    ],
  },
  '37': {
    description: 'Brake contactor feedback abnormal',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Subcode 101: The output of the brake contactor is inconsistent with the feedback.',
      'Subcode 102: When both feedback signals of the brake contactor are enabled, their states are inconsistent.',
      'Subcode 103: The output of the brake contactor is inconsistent with the brake travel switch 1 feedback.',
      'Subcode 104: When both feedback signals of brake travel switch 1 are enabled, their states are inconsistent.',
      'Subcode 105: The brake contactor feedback is valid before the brake contactor opens.',
      'Subcode 106: The output of the brake contactor is inconsistent with the brake travel switch 2 feedback.',
      'Subcode 107: When both feedback signal of brake travel switch 2 are enabled, their states are inconsistent.',
    ],
    solution: [
      [
        'Subcode 101:',
        [
          'Check whether the brake contactor opens and closes properly.',
          'Check the signal feature (NO, NC) of the feedback contact on the brake contactor is set correctly.',
          'Check whether the feedback circuit of the brake contactor is normal.',
        ],
      ],
      [
        'Subcode 102:',
        [
          'Check whether the signal feature (NO, NC) of the multi\u2013way contacts is set correctly.',
          'Check whether the states of the multi\u2013way feedback contacts are consistent.',
        ],
      ],
      [
        'Subcode 103, 105:',
        [
          'Check whether the signal feature (NO, NC) of the brake travel switch \u00bd feedback is set correctly.',
          'Check whether the circuit of the brake travel switch \u00bd feedback is normal.',
        ],
      ],
      [
        'Subcode 104, 107:',
        [
          'Check whether the signal feature (NO, NC) of the brake travel switch \u00bd feedback is set correctly.',
          'Check whether the states of the multi\u2013way feedback contacts are consistent.',
        ],
      ],
      [
        'Subcode 105:',
        [
          'Check whether the feedback contact of the brake contactor mal\u2013functions.',
        ],
      ],
    ],
  },
  '38': {
    description: 'Encoder signal abnormal',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Subcode 101: The pulses in F4\u201303 does not change within the time threshold in of F1\u201313.',
      'Subcode 102: F4\u201303 increases in down direction.',
      'Subcode 103: F4\u201303 decreases in up direction.',
      'Subcode 104:The SVC is used in distance control mode.',
    ],
    solution: [
      [
        'Subcode 101:',
        [
          'Check whether the encoder is used correctly.',
          'Check whether the brake works properly.',
        ],
      ],
      [
        'Subcodes 102, 103:',
        [
          'Check whether parameter setting and wiring of the encoder are correct.',
        ],
      ],
      [
        'Subcode 104:',
        [
          'Set F0\u201300 (Control mode) to 1 (Closed-loop vector control) in distance control mode.',
        ],
      ],
    ],
  },
  '39': {
    description: 'Motor overheat',
    level: {
      code: '3A',
      description:
        'In low-speed running, the elevator stops at special deceleration rate, and cannot restart.',
    },
    cause: [
      'Subcode 101: The motor overheat relay input remains valid for a certain time.',
    ],
    solution: [
      [
        'Subcode 101:',
        [
          'Check whether the parameter setting (NO, NC) is correct.',
          'Check whether the thermal protection relay socket is normal.',
          'Check whether the motor is used properly and whether it is damaged.',
          'Improve cooling conditions of the motor.',
        ],
      ],
    ],
  },
  '41': {
    description: 'Safety circuit disconnected',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: ['Subcode 101: The safety circuit signal becomes OFF.'],
    solution: [
      [
        'Subcode 101:',
        [
          'Check the safety circuit switches and their states.',
          'Check whether the external power supply is normal.',
          'Check whether the safety circuit contactor acts properly.',
          'Confirm the signal feature (NO, NC) of the feedback contact of the safety circuit contactor.',
        ],
      ],
    ],
  },
  '42': {
    description: 'Door lock disconnected during running',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Subcodes 101, 102: The door lock circuit feedback is invalid during the elevator running.',
    ],
    solution: [
      [
        'Subcodes 101, 102:',
        [
          'Check whether the hall door lock and the car door lock are in good contact.',
          'Check whether the door lock contactor acts properly.',
          'Check the signal feature (NO, NC) of the feedback contact on the door lock contactor.',
          'Check whether the external power supply is normal.',
        ],
      ],
    ],
  },
  '43': {
    description: 'Up limit signal abnormal',
    level: {
      code: '4C',
      description:
        'In low-speed running, the elevator does not stop. In normal-speed running, the elevator stops, and then can start running at low speed after a delay of 3s.',
    },
    cause: [
      'Subcode 101: The up limit switch acts when the elevator is running in the up direction.',
    ],
    solution: [
      [
        'Subcode 101:',
        [
          'Check the signal feature (NO, NC) of the up limit switch.',
          'Check whether the up limit switch is in good contact.',
          'Check whether the limit switch is installed at a relatively low position and acts even when the elevator arrives at the terminal floor normally.',
        ],
      ],
    ],
  },
  '44': {
    description: 'Down limit signal abnormal',
    level: {
      code: '4C',
      description:
        'In low-speed running, the elevator does not stop. In normal-speed running, the elevator stops, and then can start running at low speed after a delay of 3s.',
    },
    cause: [
      'Subcode 101: The down limit switch acts when the elevator is running in the down direction.',
    ],
    solution: [
      [
        'Subcode 101:',
        [
          'Check the signal feature (NO, NC) of the down limit switch.',
          'Check whether the down limit switch is in good contact.',
          'Check whether the limit switch is installed at a relatively high position and thus acts even when the elevator arrives at the terminal floor normally.',
        ],
      ],
    ],
  },
  '45': {
    description: 'Slow-down switch abnormal',
    level: {
      code: '4B',
      description:
        'In low-speed running, the elevator does not stop. In normal-speed running, the elevator stops, and then can start running at low speed after a delay of 3s.',
    },
    cause: [
      'Subcode 101: The down slow-down distance is insufficient during shaft auto-tuning.',
      'Subcode 102: The up slow-down distance is insufficient during shaft auto-tuning.',
      'Subcode 103: The slow- down switch is stuck or abnormal during normal running.',
    ],
    solution: [
      [
        'Subcodes 101 to 103:',
        [
          'Check whether the up slow-down switch and the down slow-down switch are in good contact.',
          'Check the signal feature (NO, NC) of the up slow-down switch and the down slow- down switch.',
          'Ensure that the obtained slow-down distance satisfies the slow-down requirement at the elevator speed.',
        ],
      ],
    ],
  },
  '46': {
    description: 'Re-leveling abnormal',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Subcode 101: The leveling signal is inactive during re-leveling.',
      'Subcode 102: The re- leveling running speed exceeds 0.1 m/s.',
      'Subcode 103: At startup of normal-speed running, the re-leveling state is valid and there is shorting door lock circuit feedback.',
      'Subcode 104: During re-leveling, no shorting door lock circuit feedback or door lock signal is received 2s after shorting door lock circuit output.',
    ],
    solution: [
      ['Subcode 101:', ['Check whether the leveling signal is normal.']],
      ['Subcode 102:', ['Check whether the encoder is used properly.']],
      [
        'Subcodes 103, 104:',
        [
          'Check whether the signal of the leveling sensor is normal.',
          'Check the signal feature (NO, NC) of the feedback contact on the shorting door lock circuit contactor, and check the relay and wiring of the SCB-A board.',
        ],
      ],
    ],
  },
  '47': {
    description: 'Shorting door lock circuit contactor abnormal',
    level: {
      code: '2B',
      description: 'The door pre-open/re-leveling function is disabled.',
    },
    cause: [
      'Subcode 101: During re-leveling or pre-open running, the shorting door lock circuit contactor outputs for continuous 2s, but the feedback is invalid and the door lock is disconnected.',
      'Subcode 102: During re-leveling or pre-open running, the shorting door lock circuit contactor has no output, but the feedback is valid for continuous 2s.',
      'Subcode 103: During re-leveling or pre-open running, the output time of the shorting door lock circuit contactor is larger than 15s.',
    ],
    solution: [
      [
        'Subcodes 101, 102:',
        [
          'Check the signal feature (NO, NC) of the feedback contact on the shorting door lock circuit contactor.',
          'Check whether the shorting door lock circuit contactor acts properly.',
        ],
      ],
      [
        'Subcode 103:',
        [
          'Check whether the leveling and re-leveling signals are normal.',
          'Check whether the re-leveling speed is set too low.',
        ],
      ],
    ],
  },
  '48': {
    description: 'Door open fault',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Subcode 101: The consecutive times that the door does not open to the limit reaches the setting in Fb-09.',
    ],
    solution: [
      [
        'Subcode 101:',
        [
          'Check whether the door machine system works properly.',
          'Check whether the CTB output is normal.',
          'Check whether the door open limit signal and door lock signal are normal.',
        ],
      ],
    ],
  },
  '49': {
    description: 'Door close fault',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Subcode 101: The consecutive times that the door does not open to the limit reaches the setting in Fb-09.',
    ],
    solution: [
      [
        'Subcode 101:',
        [
          'Check whether the door machine system works properly.',
          'Check whether the CTB output is normal.',
          'Check whether the door close limit signal and door lock signal are normal.',
        ],
      ],
    ],
  },
  '50': {
    description: 'Consecutive loss of leveling signal',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Subcode 101: Leveling signal stuck is detected for three consecutive times.',
      'Subcode 102: Leveling signal loss is detected for three consecutive times.',
    ],
    solution: [
      [
        'Subcodes 101, 102:',
        [
          'Check whether the leveling and door zone sensors work properly.',
          'Check the installation verticality and deth of the leveling plates.',
          'Check the leveling signal input points of the MCB.',
          'Check whether the steel rope slips.',
        ],
      ],
    ],
  },
  '51': {
    description: 'CAN communication abnormal',
    level: {
      code: '1A',
      description: 'The elevator running is not affected on any condition.',
    },
    cause: [
      'Subcode 101: Feedback data of CANbus communication with the CTB remains incorrect.',
    ],
    solution: [
      [
        'Handling at inspection-speed commissioning:',
        [
          'This fault does not affect inspection-speed commissioning and you can hide the fault directly on the operation panel.',
        ],
      ],
      [
        'Handling at normal-speed commissioning and running:',
        [
          'Subcode 101:',
          [
            'Check the communication cable connection.',
            'Check the power supply of the CTB.',
            'Check whether the 24 V power supply of the controller is normal.',
            'Check whether there is strong-power interference on communication.',
          ],
        ],
      ],
    ],
  },
  '52': {
    description: 'HCB communication abnormal',
    level: {
      code: '1A',
      description: 'The elevator running is not affected on any condition.',
    },
    cause: [
      'Subcode 101: Feedback data of Modbus communication with the HCB remains incorrect.',
    ],
    solution: [
      [
        'Handling at inspection-speed commissioning:',
        [
          'This fault does not affect inspection-speed commissioning and you can hide the fault directly on the operation panel.',
        ],
      ],
      [
        'Handling at normal-speed commissioning and running:',
        [
          'Subcode 101:',
          [
            'Check the communication cable connection.',
            'Check whether the 24 V power supply of the controller is normal.',
            'Check whether the HCB addresses are repeated.',
            'Check whether there is strong-power interference on communication.',
          ],
        ],
      ],
    ],
  },
  '53': {
    description: 'Door lock fault',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Subcode 101: The door lock feedback signal remains active 3s after door open output.',
      'Subcode 102: The states of the door lock multi-way feedback contacts are inconsistent 3s after door open output.',
      'Subcode 103: Reserved.',
      'Subcode 104: The higher- voltage and low-voltage door lock signals are inconsistent.',
    ],
    solution: [
      [
        'Subcode 101:',
        [
          'Check whether the door lock circuit is normal.',
          'Check whether the feedback contact of the door lock contactor acts properly.',
          'Check whether the system receives the door open limit signal when the door lock signal is valid.',
        ],
      ],
      [
        'Subcode 102:',
        [
          'Check whether when the hall door lock signal and the car door lock signal are detected separately, the detected states of the hall door locks and car door lock are inconsistent.',
        ],
      ],
      [
        'Subcode 104:',
        [
          'When the higher-voltage and low-voltage door lock signals are detected at the same time, the time when the MCB receives the two signals has a deviation of above 1.5s. This causes system protection.',
          'This subcode is reset at power-off and power-on again.',
        ],
      ],
    ],
  },
  '54': {
    description: 'Overcurrent at inspection startup',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Subcode 101: reserved',
      'Subcode 102: The current at startup for inspection exceeds 120% of the rated current.',
    ],
    solution: [
      [
        'Subcode 102:',
        [
          'Reduce the load',
          'Change Bit1 of FC-00 to 1 to cancel the startup current detection function.',
        ],
      ],
    ],
  },
  '55': {
    description: 'Stop at another landing floor',
    level: {
      code: '1A',
      description: 'The elevator running is not affected on any condition.',
    },
    cause: [
      'Subcode 101: During automatic running of the elevator, the door open limit is not received within the time threshold in Fb-06.',
    ],
    solution: [
      [
        'Subcode 101:',
        ['Check the door open limit signal at the present floor.'],
      ],
    ],
  },
  '57': {
    description: 'Serial peripheral interface (SPI) communication abnormal',
    level: {
      code: '5A',
      description:
        'In low-speed running, the elevator stops immediately and cannot restart.',
    },
    cause: [
      'Subcodes 101, 102: The SPI communication is abnormal. No correct data is received with 2s of DSP communication.',
      'Subcode 103: The MCB does not match the AC drive.',
    ],
    solution: [
      [
        'Subcodes 101, 102:',
        ['Check the wiring between the control board and the drive board.'],
      ],
      ['Subcode 103:', ['Contact Supplier.']],
    ],
  },
  '58': {
    description: 'Shaft position switches abnormal',
    level: {
      code: '4B',
      description:
        'In low-speed running, the elevator does not stop. In normal-speed running, the elevator stops, and then can start running at low speed after a delay of 3s.',
    },
    cause: [
      'Subcode 101: The up slow-down switch and down slow-down',
      'switch are disconnected simultaneously.',
      'Subcode 102: The up limit feedback and down limit feedback are disconnected simultaneously.',
    ],
    solution: [
      [
        'Subcodes 101, 102:',
        [
          'Check whether the signal feature (NO, NC) of the slow-down switches and limit switches are consistent with the parameter setting of the MCB.',
          'Check whether malfunction of the slow-down switches and limit switches exists.',
        ],
      ],
    ],
  },
  '62': {
    description: 'Analog input cable broken',
    level: {
      code: '1A',
      description: 'The elevator running is not affected on any condition.',
    },
    cause: [
      'Subcode 101: The current car load (F8\u201305) is smaller than the car no\u2013load (F8\u201306) and the deviation is larger than the threshold.',
    ],
    solution: [
      [
        'Subcode 101:',
        [
          'Check whether F5\u201336 is set correctly.',
          'Check whether the analog input cable of the CTB or MCB is connected correctly or broken.',
          'Adjust the load cell switch function.',
        ],
      ],
    ],
  },
};
