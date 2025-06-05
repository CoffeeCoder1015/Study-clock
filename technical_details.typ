#show link: underline
#show link: set text(fill: blue)

#align(center)[ #scale(150%)[ 
    == Technical details
] ]

== Boring stuff

Most of the implementation of this clock is a direct copy of the original hand-rolled javascript version and does not need any particular explanation.
The only new improvement on the old clock is an more advanced statistics tracking system.

=== The new statistics tracking system:
- A flow-chart-esque chart that lists individual events corresponding to their time of occurence rather than a lump-sum of total event duration compared to the old chart.

- Archives old statistics which enables old charts of a particular date to be looked back at

- Specific statistics tracking such as #emph()[ max\_time ] and #emph()[ session to session % change ]

#emph()[ This is all entirely attributed to a more advanced state management system in React which enables more complex systems to be built easier. ]

== Fun stuff (the globe clock-face)

Inspired by the globe watch-face on the apple watch, I am implementing a realistic globe render.

Rendering is done with THREE.js 

=== Globe rendering
The core day-night-cycle implementation is based off of:

https://github.com/vasturiano/globe.gl/blob/master/example/day-night-cycle/index.html

#align(center)[
Earth image at day, Earth image at night

$arrow.b$ 

Show day image on side facing the light, show night image on the opposite

$arrow.b$ 

Add an extra factor which for ambient light and simulates luminosity based lighting.
]

#v(2em)

#let p(x) = { $(r_#x,g_#x,b_#x,a_#x)$ }

#let pos_vec = {$vec(x,y,z)$}

$"An individual pixel color," p_i = #p("i")  \

"Image of earth at day," D  = mat(
    #p("00"), #p("10"), ..., #p("x0") ;
    #p("01"), #p("11"), ..., #p("x1") ;
    dots.v, dots.v, dots.down, dots.v ;
    #p("0y"), #p("1y"), ..., #p("xy") ;
)\

"Image of earth at night," N  = mat(
    #p("00"), #p("10"), ..., #p("x0") ;
    #p("01"), #p("11"), ..., #p("x1") ;
    dots.v, dots.v, dots.down, dots.v ;
    #p("0y"), #p("1y"), ..., #p("xy") ;
)\
$
$"Position of the light source, "L = #pos_vec  "Normal vector of vertex," accent("VN",arrow.r.long) = #pos_vec ,  \

"Dot procut gives which way is facing the light source; also indicated light intensity."\
I_0 = L dot accent("VN",arrow.r.long) = #pos_vec dot vec(x_"vn",y_"vn",z_"vn") \

"Mixing images, shader output color" G = "mix"(D,N,Beta) = (1-Beta) N + Beta D \
"Blending factor" Beta = SS(-0.1,0.1,I_0), "smoothstep function" SS
$

$"Luminosity and ambient light" G = "mix"(D,N,Beta) + Kappa I_0 + alpha\
"scaling factor for aesehtics": Kappa,
"ambient Luminosity": alpha
$


=== Sun position calculation
Calculations from NOAA: https://gml.noaa.gov/grad/solcalc/calcdetails.html

=== Atmosphere 
A basic color overlay implementation can be found here: \
https://www.youtube.com/watch?v=vM8M4QloVL0

1. #scale(90%)[*Rayleigh scattering*]

#let vn = {$accent("VN",arrow.r.long)$}
$
C "camera position",
L "Light position" \
#vn  "vertex normal",
I_0 "Intensity"
$

- Position within the atmosphere is modeled by: 
#let p(x) = { $ accent(p,arrow.r.long) (x)$ }
$
#p("x") = x dot #vn "       "  R_"earth" <= x <= R_"atmosphere" 
$
given that only the normal vector and the radii of the globe and atmosphere are simple and readily available to obtain.


- Distance to leave the atmosphere based on position:

$FF_i$ is a vector from a point in the atmosphere to a point of interest, light or camera. Where $i$ is the point of interest.


#grid(
    columns:(auto,auto),
    gutter: 3em
)[
#v(10em)

#let R = 5em
#let O = (3em,3em)
#let L = (3em,-10em)
#let norm_end = (3.0em+5*0.866em,3em+5*-0.5em) // VN x R_atmosphere + O 
#let p_x3 = (3.0em+3*0.866em,3em+3*-0.5em) // p(x) evaluate at x=3

#let u_hat = (-0.22,-0.975)
#let p_dot_u = ( 3*0.866 ) * u_hat.at(0) + ( 3*-0.5 ) * u_hat.at(1)
#let x = 3
#let d = -p_dot_u + calc.sqrt(calc.pow(p_dot_u,2) - calc.pow(x,2) + calc.pow(5,2));
#let U = (d*u_hat.at(0)*1em+p_x3.at(0),d*u_hat.at(1)*1em+p_x3.at(1))

#circle(radius:R, stroke:blue)[
    #place(line(start:L,end: O))
    #place(line(start:norm_end,end: O)) //60 degree rotation
    // #place(line(start:(7.330em,0.5em),end: (3em, -10em)))
    #place(line(start:p_x3,end: L))
    #place(dx: 2.8em,dy:-11em,"L")
    #place(dx: 2.8em,dy:3.4em,"O")
    #place(line(start:p_x3,end: U, stroke:red + 1.2pt))
    #place(line(start:O,end: U))
    #place(dx: p_x3.at(0)+0.1em,dy:p_x3.at(1)+0.3em,p("x"))
    #place(dx: U.at(0)+0.3em,dy:U.at(1)-0.7em,"U")
]
][
$
& FF_L = L - #p("x") "      " FF_C = C - #p("x")  " e.g for the light and camera" \
&
accent(u,hat) = 1/( ||FF_L|| ) FF_L  "  is the direction from" #p("x") "to L" \ 
// accent(u,hat) dot #p("x") = |#p("x")| cos(theta) = x cos(theta)  "  given that" |#p("x")| = x "by definition"
$

Let $U$ be the intersection point of $FF_i$ on the circle. 

Thus triangle $triangle"OPU"$ is formed; $P$ = $accent("OP",arrow.r.long)$

$accent("OU",arrow.r.long)$ has a length $R_"atmosphere"$ as the vector ends at the intersection point with the circle.

#let P_sub = $accent("P",arrow.r.long)$
#let OP = $accent("OP",arrow.r.long)$
$
&=>accent("OU",arrow.r.long) = #OP + d accent(u,hat)  "    where d is the distance from" #p("x") "to" U \
&=> R_"atmosphere" = |accent("OU",arrow.r.long)| = |#P_sub + d accent(u,hat)| "  where" #P_sub = #OP \
&=> ( R_"atmosphere" )^2 = |#P_sub + d accent(u,hat)|^2 = #P_sub ^ 2 + 2 d ( #P_sub dot accent(u,hat) ) + d^2 \
&=> x ^ 2 + 2 d ( #P_sub dot accent(u,hat) ) + d^2 - ( R_"atmosphere" )^2 = 0 \
&=> d ^ 2 + 2 d ( #P_sub dot accent(u,hat) ) + x^2 - ( R_"atmosphere" )^2 = 0 \
$
]
#let P_sub = $accent("P",arrow.r.long)$
#let B_no_coeff = $( #P_sub dot accent(u,hat) )$
#let C = $x^2 - ( R_"atmosphere" )^2$


$
A = 1 "  " B = 2 #B_no_coeff  "  " C = #C \

d = frac(-2 #B_no_coeff plus.minus sqrt((-2 #B_no_coeff)^2 - 4(#C)),2) \ 
=> d = -#B_no_coeff plus.minus sqrt((#P_sub dot accent(u,hat))^2 - x^2 + ( R_"atmosphere" )^2) \
=> d = -#B_no_coeff plus sqrt((#P_sub dot accent(u,hat))^2 - x^2 + ( R_"atmosphere" )^2)
$

