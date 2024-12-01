export class HandlerbarsHelper {
  static get helpers() {
    return {
      inc: function (number: number): number {
        return number + 1;
      },
      moreThanOne: function (array: unknown): boolean {
        if (Array.isArray(array)) {
          return array.length > 1;
        }
        return false;
      },
    };
  }
}
