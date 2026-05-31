export default function AvsscLogo({ size = 52 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"
      width={size} height={size} aria-label="AVSSC Logo">
      <defs>
        <path id="avssc-top" d="M 95,300 A 205,205 0 1,1 505,300" fill="none" />
        <path id="avssc-bottom" d="M 505,300 A 205,205 0 0,1 95,300" fill="none" />
      </defs>

      {/* Outer red starburst */}
      <g transform="translate(300,300)">
        <polygon points="
          0,-285 24,-270 49,-280 71,-257 98,-260 117,-231 144,-227 159,-194 185,-183 196,-147 218,-131 224,-93 242,-73 243,-34 256,-11 251,28 259,51 248,89 250,113 234,149 231,173 210,205 202,228 177,255 165,275 137,295 122,312 92,325 74,339 43,344 23,353 -9,351 -30,355 -61,345 -81,344 -110,326 -129,320 -156,296 -173,286 -197,257 -211,242 -231,209 -241,191 -255,154 -260,134 -268,95 -268,74 -271,34 -267,13 -264,-27 -255,-47 -247,-86 -234,-105 -221,-142 -205,-159 -187,-193 -167,-208 -145,-238 -122,-250 -97,-274 -73,-281 -46,-298 -22,-301"
          fill="#E41E26" />

        {/* White base disc */}
        <circle r="252" fill="#FFFFFF" stroke="#000000" strokeWidth="4" />

        {/* Inner dark ring */}
        <circle r="202" fill="none" stroke="#000000" strokeWidth="4" />

        {/* Inner white disc */}
        <circle r="162" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />

        {/* Wheelchair icon */}
        <g fill="#F37021">
          <circle cx="0" cy="-112" r="22" />
          <path d="M -15,-75 C -15,-75 15,-75 20,-75 C 25,-75 25,-52 25,-52 L 25,-22 L 85,-22 C 95,-22 95,-2 85,-2 L 20,-2 C 5,-2 -2,-12 -2,-27 L -2,-52 L -15,-52 C -23,-52 -23,-75 -15,-75 Z" />
          <path d="M 20,-10 L 68,47 L 115,12 C 122,4 135,17 125,27 L 75,72 C 65,82 50,77 45,67 L -1,0 Z" />
          <path d="M -15,-38 A 68,68 0 1,0 48,24 A 12,12 0 1,1 62,40 A 92,92 0 1,1 -15,-62 Z" />
        </g>

        {/* Teal stars and dots */}
        <polygon points="-218,-64 -212,-48 -196,-48 -208,-38 -204,-22 -218,-32 -232,-22 -228,-38 -240,-48 -224,-48" fill="#009385" />
        <polygon points="218,-64 224,-48 240,-48 228,-38 232,-22 218,-32 204,-22 208,-38 196,-48 212,-48" fill="#009385" />
        <circle cx="-212" cy="30" r="11" fill="#009385" />
        <circle cx="-195" cy="72" r="11" fill="#009385" />
        <circle cx="212" cy="30" r="11" fill="#009385" />
        <circle cx="195" cy="72" r="11" fill="#009385" />
      </g>

      {/* Curved text */}
      <text fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="44px" fill="#009385">
        <textPath href="#avssc-top" startOffset="50%" textAnchor="middle">आदर्श विकलांग सेवा संघ</textPath>
      </text>
      <text fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="44px" fill="#009385">
        <textPath href="#avssc-bottom" startOffset="50%" textAnchor="middle">मध्य प्रदेश</textPath>
      </text>
    </svg>
  )
}
