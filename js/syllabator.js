/**
 * Functions to get the syllabs given an italian word.
 * 
 * Credits to: http://www.sblendorio.eu/Misc/Sillabe
 */

export function isVowel(c) {
	return "AEIOUÁÉÍÓÚÀÈÌÒÙ".indexOf(c.toUpperCase()) != -1;
}

export function divide(word) {
	var a = word.toUpperCase();
	var result="";
	var s=0;
	while (s < a.length) {
		if (!isVowel(a.charAt(s))) {
			result += word.charAt(s); s++;
		} else if (!isVowel(a.charAt(s+1))) {
			if (s+2 >= a.length) {
				result += word.substring(s,s+2)+"-"; s += 2;
			} else if (isVowel(a.charAt(s+2))) {
				result += word.charAt(s)+"-"; s++;
			} else if (a.charAt(s+1) == a.charAt(s+2)) {
				result += word.substring(s,s+2)+"-"; s += 2;
			} else if ("SG".indexOf(a.charAt(s+1)) != -1) {
				result += word.charAt(s)+"-"; s++;
			} else if ("RLH".indexOf(a.charAt(s+2)) != -1) {
				result += word.charAt(s)+"-"; s++;
			} else {
				result += word.substring(s,s+2)+"-"; s+=2;
			}
		} else if ("IÍÌ".indexOf(a.charAt(s+1)) != -1) {
			if (s>1 && a.substring(s-1,s+1)=="QU" && isVowel(a.charAt(s+2))) {
				result += word.substring(s,s+2); s += 2;
			} else if (isVowel(a.charAt(s+2))) {
				result += word.charAt(s)+"-"; s++;
			} else {
				result += word.charAt(s); s++;
			}
		} else if ("IÍÌUÚÙ".indexOf(a.charAt(s))!=-1) {
			result += word.charAt(s); s++;
		} else {
			result += word.charAt(s)+"-"; s++;
		}
	}
	
	if (result.charAt(result.length-1)=="-")
		result = result.substring(0,result.length-1);
	return result.split("-");
}

