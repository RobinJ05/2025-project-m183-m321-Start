export default function useHelpers() {

  function isEmpty(obj) {
    let isEmpty = false;

    if (!obj || (Object.keys(obj).length === 0 && obj.constructor === Object)) {
      isEmpty = true;
    }

    return isEmpty;
  }

  return { isEmpty };
}
