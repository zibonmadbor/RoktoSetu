/**
 * Evaluates whether a user's profile is complete based on role-specific requirements.
 *
 * Mandatory fields common to all roles:
 * - name, email, phone, bloodGroup, district, address
 *
 * Additional mandatory fields for 'donor':
 * - age (>= 18), gender
 *
 * @param {Object} user - The user object or profile payload to evaluate
 * @returns {boolean} - true if profile is complete, false otherwise
 */
const checkIsProfileComplete = (user) => {
  if (!user) return false;

  const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Common mandatory fields
  const hasName = Boolean(user.name && user.name.toString().trim());
  const hasEmail = Boolean(user.email && user.email.toString().trim());
  const hasPhone = Boolean(user.phone && user.phone.toString().trim());
  const hasBloodGroup = Boolean(user.bloodGroup && validBloodGroups.includes(user.bloodGroup));
  const hasDistrict = Boolean(user.district && user.district.toString().trim());
  const hasAddress = Boolean(user.address && user.address.toString().trim());

  const commonComplete = hasName && hasEmail && hasPhone && hasBloodGroup && hasDistrict && hasAddress;

  if (!commonComplete) return false;

  // Donor-specific mandatory fields
  if (user.role === 'donor') {
    const hasAge = user.age !== undefined && user.age !== null && Number(user.age) >= 18 && Number(user.age) <= 65;
    const hasGender = Boolean(user.gender && ['male', 'female', 'other'].includes(user.gender));
    return hasAge && hasGender;
  }

  // Recipient / Admin role
  return true;
};

module.exports = { checkIsProfileComplete };
