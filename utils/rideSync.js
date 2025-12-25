import moment from 'moment'; // Make sure to run: npm install moment

// CONFIGURATION
const PREP_TIME_MINS = 20;    // Avg time to cook
const DELIVERY_BUFFER = 15;   // Avg time for delivery from restaurant to home
const SAFETY_MARGIN = 10;     // Buffer so user arrives 10 mins BEFORE food

/**
 * Calculates if we should HOLD the order or FIRE it immediately.
 * @param {number} rideDurationMinutes - The remaining time of the taxi ride.
 */
export const calculateOrderTiming = (rideDurationMinutes) => {
  const totalFoodTime = PREP_TIME_MINS + DELIVERY_BUFFER; // 35 mins
  const requiredHeadStart = rideDurationMinutes - totalFoodTime - SAFETY_MARGIN;

  if (requiredHeadStart > 0) {
    // SCENARIO: Long Ride (e.g., 60 mins). Food takes 35.
    // Action: Wait before sending to kitchen.
    return {
      action: "HOLD",
      message: `Ride is long. Holding order for ${requiredHeadStart} minutes.`,
      fireOrderAt: moment().add(requiredHeadStart, 'minutes').toISOString(),
      status: "SCHEDULED"
    };
  } else {
    // SCENARIO: Short Ride (e.g., 15 mins).
    // Action: Cook immediately!
    return {
      action: "FIRE",
      message: "Ride is short. Sending to kitchen IMMEDIATELY.",
      fireOrderAt: moment().toISOString(),
      status: "PREPARING"
    };
  }
};