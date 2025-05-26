import styles from "@/app/ui/home.module.css";
import { Clock } from "@/components/clock";

export default function Home() {
  return (
    <div className={styles.main}>
      <div>
        <Clock label="Study clock" time={{hours:0,minutes:0,seconds:0}}/>
        <Clock label="Break clock" time={{hours:0,minutes:0,seconds:0}}/>
      </div>
    </div>
  );
}
